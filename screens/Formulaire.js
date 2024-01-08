import { Text, View, TextInput, Button, Modal, StyleSheet } from "react-native"
import { useForm, Controller } from "react-hook-form"

// Méthode permettant à l'utilisateur de fournir ses mesures et de les soumettre.

const Formulaire = ({ formVisible, onCloseForm, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      nom: "",
      tourEpaule: "",
      tourPoitrine: "",
      tourTaille: "",
      tourHanches: ""
    },
  })

  const onSubmitForm = (data) => {
    console.log('Data submitted from Form:', data);
    // Appel de la fonction de rappel pour transmettre les données
    onSubmit(data); 
    onCloseForm(false);
    reset();
  }

  const onResetForm = () => {
    reset();
  }

  const onBackForm = () => {
    onCloseForm(false);
  }

  return (
    <View>
      <Modal visible={formVisible}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Nom"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="nom"
        />
        {errors.nom && <Text style={styles.innerText}>This is required.</Text>}
        <Controller
          control={control}
          rules={{
            required: true,
            pattern: /^[0-9]+$/,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Tour d'épaule (cm)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="tourEpaule"
        />
        {errors.tourEpaule && <Text style={styles.innerText}>This is required.</Text>}
        {errors.tourEpaule?.type === 'pattern' && (
          <Text style={styles.innerText}>Please enter a valid number.</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
            pattern: /^[0-9]+$/,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Tour de poitrine (cm)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="tourPoitrine"
        />

        {errors.tourPoitrine && <Text style={styles.innerText}> This is required.</Text>}
        {errors.tourPoitrine?.type === 'pattern' && (
          <Text style={styles.innerText}>Please enter a valid number.</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
            pattern: /^[0-9]+$/,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Tour de taille (cm)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="tourTaille"
        />

        {errors.tourTaille && <Text style={styles.innerText}>This is required.</Text>}
        {errors.tourTaille?.type === 'pattern' && (
          <Text style={styles.innerText}>Please enter a valid number.</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
            pattern: /^[0-9]+$/,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Tour de hanches (cm)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="tourHanches"
        />

        {errors.tourHanches && <Text style={styles.innerText}>This is required.</Text>}
        {errors.tourHanches?.type === 'pattern' && (
          <Text style={styles.innerText}>Please enter a valid number.</Text>
        )}

        <Button title="Submit" onPress={handleSubmit(onSubmitForm)} />
        <Button title="Reset" onPress={onResetForm} />
        <Button title="Back" onPress={onBackForm} />

      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  innerText: {
    color: 'red',
  },
})

export default Formulaire;