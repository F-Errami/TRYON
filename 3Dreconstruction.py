import cv2 as cv2
import numpy as np
import os
from scipy.optimize import least_squares
from tomlkit import boolean
from tqdm import tqdm
import open3d as o3d
import numpy as np


class Image_loader():
    def __init__(self, img_dir:str, downscale_factor:float):
        # loading the Camera intrinsic parameters K
        with open(img_dir + '\\K.txt') as f:
            self.K = np.array(list((map(lambda x:list(map(lambda x:float(x), x.strip().split(' '))),f.read().split('\n')))))
            self.image_list = []
        # Loading the set of images
        for image in sorted(os.listdir(img_dir)):
            if image[-4:].lower() == '.jpg' or image[-5:].lower() == '.png':
                self.image_list.append(img_dir + '\\' + image)
        
        self.path = os.getcwd()
        self.factor = downscale_factor
        self.downscale()

    
    def downscale(self) -> None:
        '''
        Downscales the Image intrinsic parameter acc to the downscale factor
        '''
        self.K[0, 0] /= self.factor
        self.K[1, 1] /= self.factor
        self.K[0, 2] /= self.factor
        self.K[1, 2] /= self.factor
    
    def downscale_image(self, image):
        for _ in range(1,int(self.factor / 2) + 1):
            image = cv2.pyrDown(image)
        return image

def find_keypoints(image_0, image_1) -> tuple:
    '''
    Fonction qui fait la detection de points d'interet
    en utilisant l'algorithme SIFT et KNN.
    Renvoie Les points d'interet de image_0 et image_1
    '''
    sift = cv2.SIFT_create()
    key_points_0, desc_0 = sift.detectAndCompute(cv2.cvtColor(image_0, cv2.COLOR_BGR2GRAY), None)
    key_points_1, desc_1 = sift.detectAndCompute(cv2.cvtColor(image_1, cv2.COLOR_BGR2GRAY), None)

    bf = cv2.BFMatcher()
    matches = bf.knnMatch(desc_0, desc_1, k=2)
    feature = []
    for m, n in matches:
        if m.distance < 0.70 * n.distance:
            feature.append(m)

    return np.float32([key_points_0[m.queryIdx].pt for m in feature]), np.float32([key_points_1[m.trainIdx].pt for m in feature])

def triangulation(point_2d_1, point_2d_2, projection_matrix_1, projection_matrix_2) -> tuple:
    '''
    Triangulation pour estimer des points 3D à partir de vecteurs 2D 
    renvoie la matrice de projection de la première caméra, celle de la deuxième caméra et le nuage de pts 3D (normalisés) 
    '''
    pt_cloud = cv2.triangulatePoints(point_2d_1, point_2d_2, projection_matrix_1.T, projection_matrix_2.T)
    return projection_matrix_1.T, projection_matrix_2.T, (pt_cloud / pt_cloud[3])    

def PnP(obj_point, image_point , K, dist_coeff, rot_vector, initial) ->  tuple:
    '''
    Finds an object pose from 3D-2D point correspondences using the RANSAC scheme.
    returns rotational matrix, translational matrix, image points, object points, rotational vector
    '''
    if initial == 1:
        obj_point = obj_point[:, 0 ,:]
        image_point = image_point.T
        rot_vector = rot_vector.T 
    _, rot_vector_calc, tran_vector, inlier = cv2.solvePnPRansac(obj_point, image_point, K, dist_coeff, cv2.SOLVEPNP_ITERATIVE)
    # Converts a rotation matrix to a rotation vector or vice versa
    rot_matrix, _ = cv2.Rodrigues(rot_vector_calc)

    if inlier is not None:
        image_point = image_point[inlier[:, 0]]
        obj_point = obj_point[inlier[:, 0]]
        rot_vector = rot_vector[inlier[:, 0]]
    return rot_matrix, tran_vector, image_point, obj_point, rot_vector

# calcul de l'erreur
def reprojection_error(obj_points, image_points, transform_matrix, K, homogenity) ->tuple:
    '''
    Calculates the reprojection error ie the distance between the projected points and the actual points.
    returns total error, object points
    '''
    rot_matrix = transform_matrix[:3, :3]
    tran_vector = transform_matrix[:3, 3]
    rot_vector, _ = cv2.Rodrigues(rot_matrix)
    if homogenity == 1:
        obj_points = cv2.convertPointsFromHomogeneous(obj_points.T)
    image_points_calc, _ = cv2.projectPoints(obj_points, rot_vector, tran_vector, K, None)
    image_points_calc = np.float32(image_points_calc[:, 0, :])
    total_error = cv2.norm(image_points_calc, np.float32(image_points.T) if homogenity == 1 else np.float32(image_points), cv2.NORM_L2)
    return total_error / len(image_points_calc), obj_points

def common_points( image_points_1, image_points_2, image_points_3) -> tuple:
    '''
    Finds the common points between image 1 and 2 , image 2 and 3
    returns common points of image 1-2, common points of image 2-3, mask of common points 1-2 , mask for common points 2-3 
    '''
    cm_points_1 = []
    cm_points_2 = []
    for i in range(image_points_1.shape[0]):
        a = np.where(image_points_2 == image_points_1[i, :])
        if a[0].size != 0:
            cm_points_1.append(i)
            cm_points_2.append(a[0][0])

    mask_array_1 = np.ma.array(image_points_2, mask=False)
    mask_array_1.mask[cm_points_2] = True
    mask_array_1 = mask_array_1.compressed()
    mask_array_1 = mask_array_1.reshape(int(mask_array_1.shape[0] / 2), 2)

    mask_array_2 = np.ma.array(image_points_3, mask=False)
    mask_array_2.mask[cm_points_2] = True
    mask_array_2 = mask_array_2.compressed()
    mask_array_2 = mask_array_2.reshape(int(mask_array_2.shape[0] / 2), 2)
    print(" Shape New Array", mask_array_1.shape, mask_array_2.shape)
    return np.array(cm_points_1), np.array(cm_points_2), mask_array_1, mask_array_2

def optimal_reprojection_error( obj_points) -> np.array:
    '''
    calculates of the reprojection error during bundle adjustment
    returns error 
    '''
    transform_matrix = obj_points[0:12].reshape((3,4))
    K = obj_points[12:21].reshape((3,3))
    rest = int(len(obj_points[21:]) * 0.4)
    p = obj_points[21:21 + rest].reshape((2, int(rest/2))).T
    obj_points = obj_points[21 + rest:].reshape((int(len(obj_points[21 + rest:])/3), 3))
    rot_matrix = transform_matrix[:3, :3]
    tran_vector = transform_matrix[:3, 3]
    rot_vector, _ = cv2.Rodrigues(rot_matrix)
    image_points, _ = cv2.projectPoints(obj_points, rot_vector, tran_vector, K, None)
    image_points = image_points[:, 0, :]
    error = [ (p[idx] - image_points[idx])**2 for idx in range(len(p))]
    return np.array(error).ravel()/len(p)

def bundle_adjustment( _3d_point, opt, transform_matrix_new, K, r_error) -> tuple:
    '''
    Bundle adjustment for the image and object points
    returns object points, image points, transformation matrix
    '''
    opt_variables = np.hstack((transform_matrix_new.ravel(), K.ravel()))
    opt_variables = np.hstack((opt_variables, opt.ravel()))
    opt_variables = np.hstack((opt_variables, _3d_point.ravel()))

    values_corrected = least_squares(optimal_reprojection_error, opt_variables, gtol = r_error).x
    K = values_corrected[12:21].reshape((3,3))
    rest = int(len(values_corrected[21:]) * 0.4)
    return values_corrected[21 + rest:].reshape((int(len(values_corrected[21 + rest:])/3), 3)), values_corrected[21:21 + rest].reshape((2, int(rest/2))).T, values_corrected[0:12].reshape((3,4))

def to_ply(path, point_cloud, colors) -> None:
    '''
    Generates the .ply which can be used to open the point cloud
    '''
    out_points = point_cloud.reshape(-1, 3) * 200
    out_colors = colors.reshape(-1, 3)
    print(out_colors.shape, out_points.shape)
    verts = np.hstack([out_points, out_colors])


    mean = np.mean(verts[:, :3], axis=0)
    scaled_verts = verts[:, :3] - mean
    dist = np.sqrt(scaled_verts[:, 0] ** 2 + scaled_verts[:, 1] ** 2 + scaled_verts[:, 2] ** 2)
    indx = np.where(dist < np.mean(dist) + 300)
    verts = verts[indx]
    ply_header = '''ply
        format ascii 1.0
        element vertex %(vert_num)d
        property float x
        property float y
        property float z
        property uchar blue
        property uchar green
        property uchar red
        end_header
        '''
    with open(path + '\\res\\' + image_file.image_list[0].split('\\')[-2] + '.ply', 'w') as f:
        f.write(ply_header % dict(vert_num=len(verts)))
        np.savetxt(f, verts, '%f %f %f %d %d %d')



img_dir = "Datasets\\GustavIIAdolf"
downscale_factor = 2
image_file = Image_loader(img_dir,downscale_factor)
pose_array = image_file.K.ravel()  # La matrice de callibration de la caméra est en 1D
transform_matrix_0 = np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]])
transform_matrix_1 = np.empty((3, 4))
pose_0 = np.matmul(image_file.K, transform_matrix_0)
pose_1 = np.empty((3, 4)) 
total_points = np.zeros((1, 3))
total_colors = np.zeros((1, 3))

image_0 = image_file.downscale_image(cv2.imread(image_file.image_list[0]))
image_1 = image_file.downscale_image(cv2.imread(image_file.image_list[1]))
feature_0, feature_1 = find_keypoints(image_0, image_1)

# Estimation de la matrice essentielle en utilisant RANSAK et filtrage des inlier
essential_matrix, em_mask = cv2.findEssentialMat(feature_0, feature_1, image_file.K, method=cv2.RANSAC, prob=0.999, threshold=0.4, mask=None)
feature_0 = feature_0[em_mask.ravel() == 1]
feature_1 = feature_1[em_mask.ravel() == 1]

# Estimation de la pose relative entre deux caméras à partir de la matrice essentielle 
# et des correspondances de points d'intérêt (inliers) entre les deux images.
_, rot_matrix, tran_matrix, em_mask = cv2.recoverPose(essential_matrix, feature_0, feature_1, image_file.K)
feature_0 = feature_0[em_mask.ravel() > 0]
feature_1 = feature_1[em_mask.ravel() > 0]
transform_matrix_1[:3, :3] = np.matmul(rot_matrix, transform_matrix_0[:3, :3])
transform_matrix_1[:3, 3] = transform_matrix_0[:3, 3] + np.matmul(transform_matrix_0[:3, :3], tran_matrix.ravel())

pose_1 = np.matmul(image_file.K, transform_matrix_1)

feature_0, feature_1, points_3d = triangulation(pose_0, pose_1, feature_0, feature_1)
error, points_3d = reprojection_error(points_3d, feature_1, transform_matrix_1, image_file.K, homogenity = 1)
#ideally error < 1
print("REPROJECTION ERROR: ", error)
_, _, feature_1, points_3d, _ = PnP(points_3d, feature_1, image_file.K, np.zeros((5, 1), dtype=np.float32), feature_0, initial=1)

total_images = len(image_file.image_list) - 2 
pose_array = np.hstack((np.hstack((pose_array, pose_0.ravel())), pose_1.ravel()))
threshold = 0.5

for i in tqdm(range(total_images)):
    image_2 = image_file.downscale_image(cv2.imread(image_file.image_list[i + 2]))
    features_cur, features_2 = find_keypoints(image_1, image_2)

    if i != 0:
        feature_0, feature_1, points_3d = triangulation(pose_0, pose_1, feature_0, feature_1)
        feature_1 = feature_1.T
        points_3d = cv2.convertPointsFromHomogeneous(points_3d.T)
        points_3d = points_3d[:, 0, :]
    

    cm_points_0, cm_points_1, cm_mask_0, cm_mask_1 = common_points(feature_1, features_cur, features_2)
    cm_points_2 = features_2[cm_points_1]
    cm_points_cur = features_cur[cm_points_1]

    rot_matrix, tran_matrix, cm_points_2, points_3d, cm_points_cur = PnP(points_3d[cm_points_0], cm_points_2, image_file.K, np.zeros((5, 1), dtype=np.float32), cm_points_cur, initial = 0)
    transform_matrix_1 = np.hstack((rot_matrix, tran_matrix))
    pose_2 = np.matmul(image_file.K, transform_matrix_1)

    error, points_3d = reprojection_error(points_3d, cm_points_2, transform_matrix_1, image_file.K, homogenity = 0)

    
    cm_mask_0, cm_mask_1, points_3d = triangulation(pose_1, pose_2, cm_mask_0, cm_mask_1)
    error, points_3d = reprojection_error(points_3d, cm_mask_1, transform_matrix_1, image_file.K, homogenity = 1)
    print("Reprojection Error: ", error)
    pose_array = np.hstack((pose_array, pose_2.ravel()))
    total_points = np.vstack((total_points, points_3d[:, 0, :]))
    points_left = np.array(cm_mask_1, dtype=np.int32)
    color_vector = np.array([image_2[l[1], l[0]] for l in points_left.T])
    total_colors = np.vstack((total_colors, color_vector)) 
    transform_matrix_0 = np.copy(transform_matrix_1)
    pose_0 = np.copy(pose_1)
    image_0 = np.copy(image_1)
    image_1 = np.copy(image_2)
    feature_0 = np.copy(features_cur)
    feature_1 = np.copy(features_2)
    pose_1 = np.copy(pose_2)
print("Printing to .ply file")
print(total_points.shape, total_colors.shape)
to_ply(image_file.path, total_points, total_colors)
print("Completed Exiting ...")
np.savetxt(image_file.path + '\\res\\' + image_file.image_list[0].split('\\')[-2]+'_pose_array.csv', pose_array, delimiter = '\n')

# reconstruction avec Alpha shapes
point_cloud = o3d.io.read_point_cloud("./res/GustavIIAdolf.ply")
# Estimer les normales
point_cloud.estimate_normals(search_param=o3d.geometry.KDTreeSearchParamHybrid(radius=0.1, max_nn=60))

# Effectuer la reconstruction de surface de Poisson
with o3d.utility.VerbosityContextManager(
        o3d.utility.VerbosityLevel.Debug) as cm:
    mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(
        point_cloud, depth=9)
print(type(mesh),type(point_cloud))
# Afficher le maillage reconstruit
#o3d.visualization.draw_geometries([mesh])
o3d.io.write_triangle_mesh("./res/GustavIIAdolf.ply", mesh)
print(mesh)
print('Vertices:')
print(np.asarray(mesh.vertices))
print('Triangles:')
print(np.asarray(mesh.triangles))
print("Computing normal and rendering it.")
mesh.compute_vertex_normals()
print(np.asarray(mesh.triangle_normals))
o3d.visualization.draw_geometries([mesh])




