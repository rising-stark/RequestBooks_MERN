import {
  Button,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    price: "",
    author: "",
    bookstate: "",
    requestedat: "",
    handledby: "",
  });
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    // console.log(e.target.name, "Value", e.target.value);
  };

  const sendRequest = async () => {
    await axios
      .post("http://localhost:5000/", {
        name: String(inputs.name),
        author: String(inputs.author),
        description: String(inputs.description),
        price: Number(inputs.price),
      })
      .then((res) => res.data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => history("/books"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent={"center"}
        maxWidth={700}
        alignContent={"center"}
        alignSelf="center"
        marginLeft={"auto"}
        marginRight="auto"
        marginTop={7}
      >
        <h4 class="m-2 text-center">Please fill in the following details to request a book </h4>
        <TextField label="Book name" name="name" variant="outlined" margin="normal" required />
        <TextField label="Author name" name="author" variant="outlined" margin="normal" required />
        <TextField label="Description" name="description" multiline margin="normal" rows={4} />
        <TextField type="number" label="Price ($)" name="author" variant="outlined" margin="normal" required />
        <Button variant="contained" type="submit">
          Request Book
        </Button>
      </Box>
    </form>
  );
};

export default AddBook;
