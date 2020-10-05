import React from 'react';
import {Grid, Paper, GridList, GridListTile} from '@material-ui/core';

class FlightInfoGrid extends React.Component 
{
  
    state = {
        depart: this.props.depart,
        return: this.props.return,
        price: '',
        flight_info: '',
        show_airlines: true,
        flight_info_group: this.props.info,
        date_departs: [], 
        date_returns: [], 
    };

    onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    }//onlyUnique

    componentDidMount() 
    {
        let date_departs = [];
        let date_returns = [];
        
        this.state.flight_info_group.map((flight_info) =>{
          date_departs.push(flight_info.depart);
          date_returns.push(flight_info.return);
          return date_returns;
        });
        
        date_departs = date_departs.filter( this.onlyUnique );
        date_returns = date_returns.filter( this.onlyUnique );

        this.setState({date_departs: date_departs});
        this.setState({date_returns: date_returns});
     }//didMount

    DisplayFlightInfo = (props) =>{
      
      let flight_info = props.group[props.group.findIndex(info => (info.depart === props.d_date && info.return===props.r_date))];
      let flight_price = "price" in flight_info ? (flight_info.price !== null?flight_info.price:"N/A"):"N/A";
      let flight_isdirect = "is_direct" in flight_info?(flight_info.price===null?"":(flight_info.is_direct===true?"":"Non-Direct Flight")):"";
      let flight_carriers = "carriers" in flight_info ?flight_info.carriers.join(", "):"";

      return  (
          <Paper className={((props.r_date === this.state.return)||(props.d_date === this.state.depart))? "paper selected-date":"paper"} square={true}> 
             <div>{flight_price}</div>
             <div className="direct-fight">{flight_isdirect}</div>
             <div>{flight_carriers}</div>
          </Paper>
      );
    }//displayFlightInfo

    render()
    {
        return(
        <Grid className="gridinfo">
          <GridList cols={(this.state.date_returns).length+1} cellHeight="auto" className="grid-list">
            <GridListTile key="p1" cols={1} className="gridcell">
                  <Paper className="paper flight-date" square={true}> Depart \ Return</Paper>
            </GridListTile>
            {this.state.date_returns.map((r_date) => (
              <GridListTile key={"r"+r_date} cols={1} className="gridcell" >
                 <Paper className={r_date === this.state.return? "paper flight-date selected-date":"paper flight-date"} square={true}>{r_date}</Paper>
              </GridListTile>
            ))}
            {this.state.date_departs.map((d_date) => (
              <GridList key={"d1"+d_date} cols={(this.state.date_returns).length+1} cellHeight="auto">
                <GridListTile key={"d"+d_date} cols={1} className="gridcell">
                  <Paper className={d_date === this.state.depart? "paper flight-date selected-date":"paper flight-date"} square={true} >{d_date}</Paper>
                </GridListTile>                
                  {  this.state.date_returns.map((r_date) => (
                     <GridListTile key={d_date+"_"+r_date} cols={1} className="gridcell">
                       <this.DisplayFlightInfo d_date={d_date} r_date={r_date} group={this.state.flight_info_group}/>
                     </GridListTile>
                )) }
              </GridList>
                )
            )}
          </GridList>
        </Grid>

        );
    }//render 

}//FlightInfoGrid

export default FlightInfoGrid;