import React from "react";
import {Button, Card, CardContent, Typography} from "@material-ui/core";

const AfterFinish = props => {
    return (<Card>
        <CardContent>
            <Typography variant="h5" gutterBottom>Post Presale Actions</Typography>
            {!props.hasSentToJustswap && (<Button style={{margin: 10}}
                onClick={props.handleSendToJustswap}
                variant="outlined"
                color="secondary"
                size="large"
            >Send To JustSwap (create liquidity pool)</Button>)}
            {!props.hasIssuedTokens && (<Button style={{margin: 10}}
                disabled={!props.hasSentToJustswap}
                onClick={props.handleIssueTokens}
                variant="outlined"
                color="secondary"
                size="large"
            >Issue tokens (mint MAZE tokens)</Button>)}
            {!props.hasSentTrx && (<Button style={{margin: 10}}
                disabled={!props.hasSentToJustswap}
                onClick={props.handleSendTrx}
                variant="outlined"
                color="secondary"
                size="large"
            >Send TRX (divide between pools)</Button>)}
        </CardContent>
    </Card>)
}

export default AfterFinish;
