/* eslint-disable no-use-before-define */
import React from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';


class CurrencyInputField extends React.Component {
      state = {
         currencies: [],
         error_status: false,
         selected_currency: null,
      };
      
      componentDidMount() {

        var cachedCurrencies = localStorage.getItem("currencies");
        if (cachedCurrencies) {
          currency_list = JSON.parse(cachedCurrencies);
          this.setState({ currencies: currency_list})
          this.setState({ error_status: false,  })
            
        } else {
            fetch(this.props.url+"/api/currencies")
            .then(res => res.json())
            .then((data) => {
              data.sort((a, b) => a.Code.localeCompare(b.Code));
              this.setState({ currencies: data})
              localStorage.setItem('currencies', JSON.stringify(data));
            })
            .catch((error)=>{
                console.log("Got error")
                console.log(error);
                this.setState({ error_status: true,  })
            })
        }//if cachedMarket

        //handle pre select market
        var cachedSelectedCurrency =  localStorage.getItem("selected_currency");
        //if (!cachedSelectedCurrency) cachedSelectedCurrency = "USD";
        if (cachedSelectedCurrency) 
        {
          let selectedCurrency= currency_list.find(currency => currency.Code === cachedSelectedCurrency);
          if (selectedCurrency) 
          {
            this.setState({ selected_currency: selectedCurrency })   
            this.props.onClickCurrency(selectedCurrency.Code);       
          }
        }//if (cachedSelectedCurrency) 

      }//componentDidMount
   
      handleChange=(event, value) => {
        if (value != null)
        {
          let selectedCurrency = this.state.currencies.find(currency => currency.Code === value.Code);
          this.setState({ selected_currency: selectedCurrency })

          this.props.onClickCurrency(value.Code);
        }        
      }//handleOnChange

      render() {
        return (
           <Box>
            <Autocomplete
              id="currency"
              options={this.state.currencies}
              getOptionLabel={option => option.Code+" - "+option.Symbol}
              value={this.state.selected_currency}
              onChange={this.handleChange}
              disabled={this.props.disable_flag}
              renderInput={params => (
                <TextField {...params} label="Currency" variant="outlined" fullWidth />
              )}
            />
            <Snackbar open={this.state.error_status} autoHideDuration={6000} anchorOrigin={{vertical:'top', horizontal:'right'}}>
              <Alert severity="error" onClose={() => {this.setState({ error_status: false,  })}}>Network error found on Currency API</Alert>
            </Snackbar>
           </Box> 
           );
    }//render
}//class

var currency_list=[];

export default CurrencyInputField;