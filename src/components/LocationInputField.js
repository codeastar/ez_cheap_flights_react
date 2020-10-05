/* eslint-disable no-use-before-define */
import React from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import * as ConstantClass from '../utils/Constants';

const locationFrom = ConstantClass.CONSTANT_LOCATION_FROM;
const locationTo = ConstantClass.CONSTANT_LOCATION_TO;
var place_list=[];

class LocationInputField extends React.Component {
      state = {
        places: [],
        error_status: false,
        selected_place: null,       
        form_text: '',
        form_id:'',   
      }

      componentDidMount() {
        //handle pre select place
        var cachedSelectedPlace;
        if (this.props.type === locationFrom)
        {
            cachedSelectedPlace = localStorage.getItem("selected_from");
            this.setState({ form_text: "From" });
            this.setState({ form_id: "From" });
        }
        else if (this.props.type === locationTo)    
        {   
             cachedSelectedPlace = localStorage.getItem("selected_to");
             this.setState({ form_text: "To" });
             this.setState({ form_id: "To" });
        }//if type

        var cachedPlaces = localStorage.getItem("places");
        if (cachedPlaces) {
          place_list = JSON.parse(cachedPlaces);
          this.setState({ places: place_list})
          this.setState({ error_status: false })
            
        } else {
            fetch(this.props.url+"/api/places")
            .then(res => res.json())
            .then((data) => {
              data.sort((a, b) => a.PlaceName.localeCompare(b.PlaceName));
              localStorage.setItem('places', JSON.stringify(data));
            })
            .catch((error)=>{
                console.log("Got error")
                console.log(error);
                this.setState({ error_status: true,  })
            })
        }//if cachedMarket

        //if (!cachedSelectedCurrency) cachedSelectedCurrency = "USD";
        if (cachedSelectedPlace) 
        {
          let selectedPlace= place_list.find(place => place.Iata === cachedSelectedPlace);
          if (selectedPlace) 
          {
            this.setState({ selected_place: selectedPlace })   
            this.props.onClickLocation(selectedPlace.Iata);       
          }
        }//if (cachedSelectedCurrency) 
      }//componentDidMount
   
      handleChange=(event, value) => {
        if (value != null)
        {
          let selectedPlace = this.state.places.find(place => place.Iata === value.Iata);

          if (selectedPlace)
          {
            this.setState({ selected_place: selectedPlace })
            this.props.onClickLocation(value.Iata);
          }        
        }//if value != null        
      }//handleOnChange

      render() {
        return (
           <Box>
            <Autocomplete
              id={this.state.form_id}
              options={this.state.places}
              getOptionLabel={option => option.PlaceName+", "+option.CountryName + " ("+option.Iata+")"}
              value={this.state.selected_place}
              onChange={this.handleChange}
              disabled={this.props.disable_flag}
              renderInput={params => (
                <TextField {...params} label={this.state.form_text} variant="outlined" fullWidth />
              )}
            />
            <Snackbar open={this.state.error_status} autoHideDuration={6000} anchorOrigin={{vertical:'top', horizontal:'right'}}>
              <Alert severity="error" onClose={() => {this.setState({ error_status: false,  })}}>Network error found on Location API</Alert>
            </Snackbar>
           </Box> 
           );
    }//render
}//class

export default LocationInputField;