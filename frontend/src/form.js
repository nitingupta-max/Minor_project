import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import Typography from "@mui/material/Typography";

const options = [
  { value: 1, label: "Category food dining" },
  { value: 2, label: "Category gas transport" },
  { value: 3, label: "Category grocery net" },
  { value: 4, label: "Category grocery pos" },
  { value: 5, label: "Category health fitness" },
  { value: 6, label: "Category home" },
  { value: 7, label: "Category kids pets" },
  { value: 8, label: "Category misc net" },
  { value: 9, label: "Category misc pos" },
  { value: 10, label: "Category personal care" },
  { value: 11, label: "Category shopping net" },
  { value: 12, label: "Category shopping pos" },
  { value: 13, label: "Category travel" },
];

function Form() {
  const { register, handleSubmit } = useForm();
  const [value, setValue] = useState("");
  const [prediction, setPrediction] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const onSubmit = (data) => {
    // console.log(register);
    // console.log(data);

    let formData = new FormData();

    for (const name in data) {
      formData.append(name, data[name]);
    }

    fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("Success:", data);
        setPrediction(data.prediction);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "30%",
          margin: "40px auto",
        }}
      >
        <TextField
          {...register("amt")}
          label="Amount"
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          {...register("gender")}
          label="Gender"
          variant="outlined"
          style={{ marginTop: "6px" }}
          autoComplete="off"
        />
        <TextField
          {...register("city_pop")}
          label="City Population"
          variant="outlined"
          style={{ marginTop: "6px" }}
          autoComplete="off"
        />
        <TextField
          {...register("age")}
          label="Age"
          variant="outlined"
          style={{ marginTop: "6px" }}
          autoComplete="off"
        />
        <TextField
          {...register("trans_month")}
          label="Transaction Month"
          variant="outlined"
          style={{ marginTop: "6px" }}
          autoComplete="off"
        />
        <TextField
          {...register("trans_year")}
          label="Transaction Year"
          variant="outlined"
          style={{ marginTop: "6px" }}
          autoComplete="off"
        />
        <TextField
          {...register("latitudinal_distance")}
          label="Latitudinal Distance"
          variant="outlined"
          style={{ marginTop: "6px" }}
          autoComplete="off"
        />
        <TextField
          {...register("longitudinal_distance")}
          label="Longitudinal Distance"
          variant="outlined"
          style={{ marginTop: "6px", color: "#fff" }}
          autoComplete="off"
        />
        <FormControl variant="outlined" fullWidth style={{ marginTop: "6px" }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            {...register("category")}
            labelId="category-label"
            id="category-select"
            value={value}
            onChange={(e) => handleChange(e)}
            label="Category"
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: "2rem" }}
        >
          Submit
        </Button>
      </div>
      <Typography variant="h3" align="center" mt={4} color="#000">
        {prediction}
      </Typography>
    </form>
  );
}

export default Form;
