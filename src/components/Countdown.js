import React from "react";
import {Box, Card, CardContent, Grid, Typography} from "@material-ui/core";
import Timer from "react-compound-timer"

const withTimer = timerProps => WrappedComponent => wrappedComponentProps => {
    return (
        <Box style={{height: "100%"}}>
            {wrappedComponentProps.initialTime > 0 && (
                <Timer
                    {...timerProps}>
                    {timerRenderProps =>
                        <WrappedComponent {...wrappedComponentProps} timer={timerRenderProps}/>}
                </Timer>
            )}
        </Box>
    )
}

class ClockUpDown extends React.Component {
    componentDidMount() {
        const {setCheckpoints, setTime, start} = this.props.timer;
        setCheckpoints([
            {
                time: 0,
                callback: () => window.location.reload(),
            },
        ]);
        setTime(this.props.initialTime);
        setInterval(() => {
            start();
        }, 1000);
    }

    renderSlim() {
        return ( <Grid container justify="center">
            {this.props.slim !== true && (<Grid item xs={12}>
                <Typography align="center" variant="h4"
                            gutterBottom>{this.props.title || 'Countdown'}</Typography>
            </Grid>)}
            <Grid item>
                <Typography align="center">DAYS</Typography>
                <Typography variant="h2" color="secondary"><strong><Timer.Days/></strong></Typography>
            </Grid>
            <Grid item>
                <Typography align="center">&nbsp;</Typography>
                <Typography variant="h2"
                            style={{paddingLeft: 6, paddingRight: 6}}><strong>:</strong></Typography>
            </Grid>
            <Grid item>
                <Typography align="center">HOURS</Typography>
                <Typography variant="h2" color="secondary"><strong><Timer.Hours/></strong></Typography>
            </Grid>
            <Grid item>
                <Typography align="center">&nbsp;</Typography>
                <Typography variant="h2"
                            style={{paddingLeft: 6, paddingRight: 6}}><strong>:</strong></Typography>
            </Grid>
            <Grid item>
                <Typography align="center">MINUTES</Typography>
                <Typography variant="h2"
                            color="secondary"><strong><Timer.Minutes/></strong></Typography>
            </Grid>
            <Grid item>
                <Typography align="center">&nbsp;</Typography>
                <Typography variant="h2"
                            style={{paddingLeft: 6, paddingRight: 6}}><strong>:</strong></Typography>
            </Grid>
            <Grid item>
                <Typography align="center">SECONDS</Typography>
                <Typography variant="h2"
                            color="secondary"><strong><Timer.Seconds/></strong></Typography>
            </Grid>
        </Grid>)
    }

    render() {
        return this.props.slim === true ? this.renderSlim() : (
            <Card style={{height: "100%"}}>
                <CardContent>
                    {this.renderSlim()}
                </CardContent>
            </Card>
        );
    }
}

const Countdown = withTimer({
    direction: 'backward',
    initialTime: 0,
    startImmediately: false,
    formatValue: value => value < 10 ? `0${value}` : value
})(ClockUpDown);

export default Countdown;
