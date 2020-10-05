/* eslint-disable no-use-before-define */
import React from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

class MarketInputField extends React.Component {
      state = {
        markets: [],
        error_status: false,
        selected_market: null,
      }

      componentDidMount() {
        var cachedMarkets = localStorage.getItem("markets");
        if (cachedMarkets) {
            market_list = JSON.parse(cachedMarkets);
            this.setState({ markets:  market_list})
            this.setState({ error_status: false,  })
        } else {
            //call the market api
            fetch(this.props.url+"/api/markets")
            .then(res => res.json())
            .then((data) => {
              data.sort((a, b) => a.Name.localeCompare(b.Name));
              this.setState({ markets: data})
              localStorage.setItem('markets', JSON.stringify(data));
            })
            .catch((error)=>{
                console.log("Got error")
                console.log(error);
                this.setState({ error_status: true,  })
            })
        }//if cachedMarket

        //handle pre select market
        var cachedSelectedMarket =  localStorage.getItem("selected_market");
        if (!cachedSelectedMarket) cachedSelectedMarket = this.props.locale.slice(-2);
        let selectedMarket= market_list.find(market => market.Code === cachedSelectedMarket);
        if (selectedMarket) 
        {
          this.setState({ selected_market: selectedMarket })   
          this.props.onClickMarkert(selectedMarket.Code);       
        }
      }//componentDidMount
   
      handleChange=(event, value) => {
        if (value != null)
        {
          let selectedMarket = this.state.markets.find(market => market.Name === value.Name);
          this.setState({ selected_market: selectedMarket })
          this.props.onClickMarkert(value.Code);
        }        
      }//handleOnChange

      render() {
        return (
           <Box>
            <Autocomplete
              id="market"
              options={this.state.markets}
              getOptionLabel={option => option.Name}
              value={this.state.selected_market}
              onChange={this.handleChange}
              onClose={this.handleClose}
              disabled={this.props.disable_flag}
              renderInput={params => (
                <TextField {...params} label="Market" variant="outlined" fullWidth />
              )}
            />
            <Snackbar open={this.state.error_status} autoHideDuration={6000} anchorOrigin={{vertical:'top', horizontal:'right'}}>
              <Alert severity="error" onClose={() => {this.setState({ error_status: false,  })}}>Network error found on Market API</Alert>
            </Snackbar>
           </Box> 
           );
    }//render
}//class

var market_list=[];

export default MarketInputField;