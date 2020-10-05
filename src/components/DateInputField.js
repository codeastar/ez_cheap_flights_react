import 'date-fns';
import React from 'react';
import Box from '@material-ui/core/Box';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

class DateInputField extends React.Component 
{ 
   state = {
        selectedDate: this.props.startDate,
        error_status: false,
    }

    componentDidMount() {
        this.props.onClickDate(this.state.selectedDate);
    };//DidMount

    handleDateChange = (date) => {
        this.setState({ selectedDate: date });
        this.props.onClickDate(date);
    };
  
    render()
    {
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Box>
                    <KeyboardDatePicker
                        autoOk
                        variant="inline"
                        inputVariant="outlined"
                        label={this.props.type}
                        format="MM/dd/yyyy"
                        style={{ width: "100%" }}
                        value={this.props.startDate}
                        minDate={this.props.fromDate}
                        InputAdornmentProps={{ position: "start" }}
                        disabled={this.props.disable_flag}
                        onChange={this.handleDateChange}
                    />
                </Box>
            </MuiPickersUtilsProvider >
        );
    }//render
 
}//DateInputField

export default DateInputField;