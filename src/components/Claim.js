import React from "react";
import {Box, Button, Typography} from "@material-ui/core";
import CardBox from "./CardBox";
import CountUp from "react-countup";
import Countdown from "./Countdown";

const Claim = props => {
    // console.error(props)
    return props.userClaimed < props.userTokens ? (
        <CardBox>
            <Typography align="center" variant="h3" color="secondary"
                        gutterBottom>{props.title || 'Claim Your MAZE Tokens'}</Typography>

            <Typography variant="h3" color="secondary" align="center">
                <CountUp end={props.userRedeemable} decimals={2}/>
            </Typography>
            <Box style={{display: 'flex'}}>
                <Button variant="contained"
                        color="secondary"
                        size="large"
                        onClick={() => props.handleRedeem(props.userRedeemable)}
                        style={{margin: '10px auto'}}
                        disabled={props.userRedeemable === 0}
                >Claim</Button>
            </Box>

            <Typography align="center"><CountUp end={props.userTokens / 50} decimals={2}/> MAZE per hour</Typography>
            <Typography align="center">Already claimed: <CountUp end={props.userClaimed}
                                                                 decimals={2}/> MAZE</Typography>
            {props.userClaimed < props.userTokens && (props.userRedeemable) < props.userTokens && (
                <Box>
                    <Typography align="center" style={{display: 'block', marginBottom: 20}}>
                        More MAZE to claim avaliable in
                    </Typography>
                    <Countdown
                        slim={true}
                        initialTime={props.nextRedeemTime}
                    />
                </Box>
            )}

        </CardBox>
    ) : (
        <CardBox>
            <Typography align="center" variant="h3" color="secondary"
                        gutterBottom>{props.title || 'Claimed MAZE'}</Typography>
            <Typography variant="h3" color="secondary" align="center" style={{fontWeight: 'bold'}}>
                <CountUp end={props.userClaimed} decimals={2}/>
            </Typography>
        </CardBox>
    )
}

export default Claim;
