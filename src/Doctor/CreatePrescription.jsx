import { useParams } from "react-router"

const CreatePrescription = () => {

    const { id } = useParams()

  return (
    <div>
      <h1>Create presscription</h1>
      <h2>Id : {id}</h2>
    </div>
  )
}

export default CreatePrescription
