import React, {useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    FormControl,
    FormControlLabel,
    FormHelperText,
    LinearProgress,
    Radio,
    RadioGroup, Tab, Tabs, List, ListItem
} from "@material-ui/core";
import {Alert, AlertTitle} from "@material-ui/lab";

const VoteResults = props => {
    const data = {
        'MAZE staking': props.votersCount ? Math.floor(100 * props.stakeMazeCount / props.votersCount) : 0,
        'MAZE/TRX LP staking': props.votersCount ? Math.floor(100 * props.stakeMazeTrxCount / props.votersCount) : 0,
        '*/MAZE LP staking (eg. SUN/MAZE, USDT/MAZE, BTC/MAZE)': props.votersCount ? Math.floor(100 * props.stakeMazeMultiCount / props.votersCount) : 0,
        'Burn them all': props.votersCount ? Math.floor(100 * props.burnCount / props.votersCount) : 0,
    }
    const canBurn = (
        props.canBurn &&
        props.burnCount > props.stakeMazeCount &&
        props.burnCount > props.stakeMazeTrxCount &&
        props.burnCount > props.stakeMazeMultiCount
    );
    return (
        <Box>
            <List>
                {Object.keys(data).map(key => (
                    <ListItem key={Object.keys(data).indexOf(key)}
                              alignItems="flex-start"
                              style={{flexDirection: 'column'}}>
                        <Box style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            width: "100%"
                        }}>
                            <Typography style={{marginRight: 20}}>{key}</Typography>
                            <Typography><strong>{data[key]}%</strong></Typography>
                        </Box>
                        <LinearProgress
                            style={{width: '100%'}}
                            variant="determinate" value={data[key]}/>
                    </ListItem>
                ))}
            </List>
            {canBurn && (
                <Box>
                {
                    props.isBurned ? (
                        <Alert severity="info" style={{marginTop: 20}}>
                            <AlertTitle>Already burned</AlertTitle>
                        </Alert>
                    ) : (
                        <Box style={{display: 'flex', justifyContent: 'center', marginTop: 10}}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={props.handleBurn}
                            >BURN</Button>
                        </Box>
                    )
                }
                </Box>
            )}
        </Box>
    );
}

const VoteTabs = props => {

    const [value, setValue] = useState(props.value);
    const [tab, setTab] = useState(props.value ? 1 : 0);
    if (parseInt(value) === 0 && 0 !== parseInt(props.value)) {
        setValue(props.value);
    }
    const handleRadioChange = event => {
        setValue(event.target.value);
    };
    const handleSubmit = async event => {
        event.preventDefault();
        await props.handleVote(parseInt(value));
        setTab(1);
    }
    const handleTab = (event, newValue) => {
        setTab(newValue);
    };
    return (
        <Box>
            <Tabs
                value={tab}
                onChange={handleTab}
                indicatorColor="secondary"
                textColor="secondary"
                variant="fullWidth"
                aria-label="full width tabs example">
                <Tab label="Form"></Tab>
                <Tab label="Results"></Tab>
            </Tabs>
            <Box>
                {tab === 0 && (<form onSubmit={handleSubmit}>
                    <FormControl component="fieldset" style={{alignItems: "flex-start", padding: 16}}>
                        <RadioGroup value={value} onChange={handleRadioChange}>
                            <FormControlLabel value="2" control={<Radio/>} label="MAZE staking"/>
                            <FormControlLabel value="3" control={<Radio/>} label="MAZE/TRX LP staking"/>
                            <FormControlLabel value="4" control={<Radio/>}
                                              label="*/MAZE LP staking (eg. SUN/MAZE, USDT/MAZE, BTC/MAZE)"/>
                            <FormControlLabel value="1" control={<Radio/>} label="Burn them all"/>
                        </RadioGroup>
                        <FormHelperText style={{paddingBottom: 12}}>Everyone who deposits at
                            least <strong>{props.minimalTrxDeposit} TRX</strong> in the
                            Presale can vote what should we do with staking fund.</FormHelperText>
                        <Button type="submit" variant="outlined" color="secondary"
                                disabled={props.userTrx < props.minimalTrxDeposit}>
                            {parseInt(props.value) === 0 ? "Vote" : "Change your vote"}
                        </Button>
                    </FormControl>
                </form>)}
                {tab === 1 && (
                    <VoteResults {...props} />
                )}
            </Box>
        </Box>
    );
}


const Vote = props => {

    return (
        <Card style={{height: '100%'}}>
            <CardContent>
                <Typography align="center" variant="h4" gutterBottom>Vote</Typography>
                {(props.tronLinkLoggedIn && !props.isFinished) ?
                    (<VoteTabs {...props} />) :
                    (<VoteResults {...props} />)}
            </CardContent>
        </Card>
    )
}

export default Vote;
