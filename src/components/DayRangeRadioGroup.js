import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

class DayRangeRadioGroup extends React.Component 
{
    handleDayChange = (day) => {
        this.props.onChangeDay(day.target.value);
    };

    render()
    {
        return (
            <FormControl component="fieldset">
              <FormLabel component="legend" >+/- Day(s)</FormLabel>
              <RadioGroup row aria-label="position" name="position" defaultValue="1" onChange={this.handleDayChange}>
                <FormControlLabel value="0" control={<Radio color="primary" />} label="0" />
                <FormControlLabel value="1" control={<Radio color="primary" />} label="1" />
                <FormControlLabel value="2" control={<Radio color="primary" />} label="2" />
                <FormControlLabel value="3" control={<Radio color="primary" />} label="3" />
              </RadioGroup>
            </FormControl>
          );
    }//render
}//DayRangeRadioGroup

export default DayRangeRadioGroup;