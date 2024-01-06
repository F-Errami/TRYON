import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';

const VideoButton = ({ onVideoTaken }) => {
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(Camera.Constants.Type.back);
  const [record, setRecord] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === 'granted');
    })();
  }, []);

  const takeVideo = async () => {
    if (cameraRef) {
      const data = await cameraRef.recordAsync({
        maxDuration: 10,
        mute: false,
      });
      setRecord(data.uri);
      console.log(data.uri);
    }
  };

  const stopVideo = async () => {
    if (cameraRef) {
      cameraRef.stopRecording();
    }
  };

  const flipCamera = () => {
    setSelectedCamera(
      selectedCamera === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <View />;
  }

  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.centeredView}>
      {selectedCamera === Camera.Constants.Type.back ? (
        <Camera
          ref={(ref) => setCameraRef(ref)}
          style={styles.fixedRatio}
          type={selectedCamera}
          ratio={'4:3'}
        />
      ) : (
        <Camera
          ref={(ref) => setCameraRef(ref)}
          style={styles.fixedRatio}
          type={selectedCamera}
          ratio={'4:3'}
          frontMirror={true} 
        />
      )}
      <Button title="Flip Video" onPress={flipCamera} />
      <Button title="Take video" onPress={takeVideo} />
      <Button title="Stop Video" onPress={stopVideo} />
      {record && (
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: record,
          }}
          useNativeControls
          resizeMode="contain"
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      )}
      <View style={styles.button}>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 4 / 3,
    width: '100%',
  },
  video: {
    width: '100%',
    height: 300,
  },
  button: {
    marginTop: 20,
  },
});

export default VideoButton;
