import React from 'react';
import {Box, Grid, Container, Typography, Button, Backdrop, Checkbox, FormControlLabel} from '@material-ui/core';
import MarketInputField from './components/MarketInputField';
import CurrencyInputField from './components/CurrencyInputField';
import LocationInputField from './components/LocationInputField';
import DateInputField from  './components/DateInputField';
import FlightInfoGrid from './components/FlightInfoGrid';
import DayRangeRadioGroup from './components/DayRangeRadioGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import './App.css';
import getUserLocale from 'get-user-locale';
import * as ConstantClass from './utils/Constants';
import axios from 'axios';
import Moment from 'moment';

class App extends React.Component {
   state = {
       selected_market: '',
       selected_currency: '',
       selected_location_from: '',
       selected_location_to: '',
       selected_departing: new Date(),
       selected_returning: new Date(),
       url: process.env.REACT_APP_EZ_SKYSCANNER_API,  
       locale: getUserLocale(),  
       find_status: '',
       flight_info: null,
       blackdrop_flag: false,
       disable_flag: false,
       direct_flight_flag: true,
       day_range: 1,
  }
  
  handleClick=() => {
    localStorage.setItem('selected_market', this.state.selected_market);
    localStorage.setItem('selected_currency', this.state.selected_currency);
    localStorage.setItem('selected_from', this.state.selected_location_from);
    localStorage.setItem('selected_to', this.state.selected_location_to);

    //show backdrop
    this.setState({ backdrop_flag: true});
    this.setState({disable_flag: true});
    this.setState({find_status: "Searching flight info..."});
    this.setState({flight_info: null});
    
    let query_data = {
      market:this.state.selected_market,
      currency: this.state.selected_currency,
      date_depart:this.state.selected_departing,
      date_return:this.state.selected_returning,
      place_from:this.state.selected_location_from,
      place_to:this.state.selected_location_to,
      directFlag:this.state.direct_flight_flag, 
      day_range: this.state.day_range,
    };
    //axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.post(this.state.url+"api/findflight", query_data)
      .then(res => {
        let json_res = res.data;
        let flight_info_group = json_res.flight_info_group;

        let message = "";
        if (flight_info_group === null)
        {
          message = ConstantClass.CONSTANT_ERROR_TAG;
        }
        else
        {
          let flight_info_array = flight_info_group.map(flight_info => { return flight_info; })
          this.setState({ flight_info: flight_info_array});          
        }//if === error
        this.handleClose(message);
      })
  };  // handleClick

  handleMarket = (selectedMarket) => {
    this.setState({ selected_market: selectedMarket});
  }//handle MArket

  handleCurrency = (selectedCurrency) => {
    this.setState({ selected_currency: selectedCurrency});
  }//handleCurrency

  handleLocationFrom = (fromLocation) => {
    this.setState({ selected_location_from: fromLocation});
  }//handleLocationFrom

  handleLocationTo = (toLocation) => {
    this.setState({ selected_location_to: toLocation});
  }//
  
  handleDeparting = (departDate) => {
    if (Date.parse(departDate) > Date.parse(this.state.selected_returning))
      this.setState({ selected_returning: departDate});

    this.setState({ selected_departing: Moment(departDate).format("YYYY-MM-DD")});
  }//handleDeparting

  handleReturning = (returnDate) => {
    this.setState({ selected_returning: Moment(returnDate).format("YYYY-MM-DD")});
  }//handleReturning

  handleClose = (message) => 
  {
    this.setState({ backdrop_flag: false});
    this.setState({ disable_flag: false});
    this.setState({find_status: message});
  }; //handleClose

  handleDirectFlight = (event) => 
  {
    this.setState({ direct_flight_flag: event.target.checked});
  };//handleDirectFlight

  handleDayRange = (day)=>
  {
      this.setState({ day_range: day});
  };//handleDayRange

  isFindNotReady()
  {
    let validStatus = ((this.state.selected_currency !== '') && (this.state.selected_market !== '') 
    && (this.state.selected_location_to !== '') && (this.state.selected_location_from !== ''));
    return (!validStatus || this.state.disable_flag);
  }

  componentDidMount() {

  }//componentDidMount

  render() {
    return (
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box bgcolor="info.main" color="info.contrastText" p={1}>
              <Typography variant="h4" component="h1">
                EZ Cheap Flights Seeker
              </Typography>
            </Box>
          </Grid>
          <Grid item lg={6} xs={12}>
             <MarketInputField onClickMarkert={this.handleMarket} url={this.state.url} locale={this.state.locale} disable_flag={this.state.disable_flag} />
          </Grid> 
          <Grid item lg={6} xs={12}>
             <CurrencyInputField onClickCurrency={this.handleCurrency} url={this.state.url} disable_flag={this.state.disable_flag} />
          </Grid>
          <Grid item lg={6} xs={12}>
             <LocationInputField onClickLocation={this.handleLocationFrom} url={this.state.url} type={ConstantClass.CONSTANT_LOCATION_FROM} disable_flag={this.state.disable_flag} />
          </Grid> 
          <Grid item lg={6} xs={12}>
             <LocationInputField onClickLocation={this.handleLocationTo} url={this.state.url} type={ConstantClass.CONSTANT_LOCATION_TO} disable_flag={this.state.disable_flag} />
          </Grid>
          <Grid item lg={6} xs={12}>
             <DateInputField onClickDate={this.handleDeparting} type={ConstantClass.CONSTANT_DEPARTING} startDate={this.state.selected_departing} fromDate={Moment().format("YYYY-MM-DD")} disable_flag={this.state.disable_flag} />
          </Grid> 
          <Grid item lg={6} xs={12}>
             <DateInputField onClickDate={this.handleReturning} type={ConstantClass.CONSTANT_RETURNING} startDate={this.state.selected_returning} fromDate={this.state.selected_departing} disable_flag={this.state.disable_flag} />
          </Grid>     
          <Grid item lg={6}>
            <FormControlLabel
             control={
             <Checkbox checked={this.state.direct_flight_flag} onChange={this.handleDirectFlight} name="checkedB" color="primary"  /> 
               }
               label="Direct flight only" disabled={this.state.disable_flag}
             />          
          </Grid> 
          <Grid item lg={6}>
             <DayRangeRadioGroup onChangeDay={this.handleDayRange}/>
          </Grid>    
          <Grid item xs={12}>
             <Button variant="contained" startIcon={<FlightTakeoffIcon />} fullWidth={true} color="primary" onClick={this.handleClick} disabled={this.isFindNotReady()}>Find Flights!</Button>
          </Grid>   
          <Grid item xs={12}>
          { this.state.flight_info !== null &&
            <FlightInfoGrid info={this.state.flight_info} depart={this.state.selected_departing} return={this.state.selected_returning}/>
          }  
            <Box>         
                 {this.state.find_status}       
            </Box>
          </Grid>                        
        </Grid>               

        <Backdrop open={this.state.backdrop_flag} className="backdrop">
           <CircularProgress color="primary" />
        </Backdrop>
  
      </Container>
    );
  }//render
}//class

export default App;