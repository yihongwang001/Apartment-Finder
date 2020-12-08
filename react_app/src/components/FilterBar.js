import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Button,
  InputLabel,
  FormControl,
  NativeSelect,
  Slider,
  TextField,
} from '@material-ui/core';

const FilterBar = (props) => {
  const useStyles = makeStyles((theme) => ({
    filterBarBox: {
      display: 'flex',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 10,
    },
    slideComponent: {
      marginRight: 20,
    },
    slideBar: {
      width: 300,
      marginBottom: -5,
    },
    dropdownSelector: {
      minWidth: 130,
    },
    datePicker: {
      minWidth: 130,
    },
  }));
  const classes = useStyles();

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  let todayString = yyyy + '-' + mm + '-' + dd;

  const [price, setPrice] = useState([0, 8000]);
  const [bedroom, setBedroom] = useState(0);
  const [area, setArea] = useState(0);
  const [startDate, setStartDate] = useState('2020-09-01');
  const [endDate, setEndDate] = useState(todayString);

  const handlePriceChange = (event, newPrice) => {
    setPrice(newPrice);
  };

  const handleBedroomChange = (event) => {
    setBedroom(event.target.value);
  };

  const handleAreaChange = (event) => {
    setArea(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const applyFilter = () => {
    if (startDate > endDate) {
      alert('Start date should less than or equal to end date!');
      return;
    }
    var params = {
      priceLow: price[0],
      priceHigh: price[1],
      bedroom: bedroom,
      area: area,
      startDate: startDate,
      endDate: endDate,
    };
    props.updateFetchUrl(
      '/posts?'.concat(new URLSearchParams(params).toString())
    );
  };

  const clearFilter = () => {
    setPrice([0, 8000]);
    setBedroom(0);
    setArea(0);
    setStartDate('2020-09-01');
    setEndDate(todayString);

    props.updateFetchUrl('/posts?'.concat(new URLSearchParams({}).toString()));
  };

  return (
    <Box className={classes.filterBarBox}>
      <div className={classes.slideComponent}>
        <InputLabel shrink>Price range ($/month)</InputLabel>
        <Slider
          value={price}
          min={0}
          step={100}
          max={10000}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          className={classes.slideBar}
        />
      </div>
      <FormControl className={classes.dropdownSelector}>
        <InputLabel shrink>Bedroom</InputLabel>
        <NativeSelect
          value={bedroom}
          onChange={handleBedroomChange}
          inputProps={{
            name: 'bedroom',
            id: 'bedroom-label',
          }}
        >
          <option value={0}>All</option>
          <option value={1}>1+</option>
          <option value={2}>2+</option>
          <option value={3}>3+</option>
          <option value={4}>4+</option>
        </NativeSelect>
      </FormControl>
      <FormControl className={classes.dropdownSelector}>
        <InputLabel shrink>Square feet</InputLabel>
        <NativeSelect
          value={area}
          onChange={handleAreaChange}
          inputProps={{
            name: 'area',
            id: 'area-label',
          }}
        >
          <option value={0}>All</option>
          <option value={500}>500+</option>
          <option value={1000}>1000+</option>
          <option value={1500}>1500+</option>
          <option value={2000}>2000+</option>
          <option value={2000}>2500+</option>
        </NativeSelect>
      </FormControl>
      <Box display="inline" className={classes.datePicker}>
        <TextField
          id="startdate"
          label="Posts start from"
          type="date"
          value={startDate}
          className={classes.textField}
          onChange={handleStartDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="enddate"
          label="Posts end with"
          type="date"
          onChange={handleEndDateChange}
          value={endDate}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      <Box mt={2} ml={1} clone>
        <Button variant="contained" color="primary" onClick={applyFilter}>
          Search
        </Button>
      </Box>
      <Box mt={2} ml={1} clone>
        <Button variant="contained" color="primary" onClick={clearFilter}>
          Clear
        </Button>
      </Box>
    </Box>
  );
};

export default FilterBar;
