import React, {useState} from "react";
import {Box, Card, CardContent, Typography, Button, Snackbar, Grid} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import CardContractAddress from "./CardContractAddress";
import CountUp from "react-countup";

const ReferralLink = props => {
    const referralLink = `${props.prefix || window.location.origin}/#/referral/${props.address}`;
    const [copied, setCopied] = useState(false);
    return (
        <Box>
            {props.address && (
                <Grid
                    spacing={3}
                    alignItems="stretch"
                    container>
                    <Grid item xs={12} lg={props.referralCount || props.displayContractAddress ? 8 : 12}>
                        <Card style={{height: "100%"}}>
                            <CardContent>
                                <Typography gutterBottom variant="h5">
                                    Refferal Code
                                </Typography>
                                <Typography gutterBottom variant="body2">
                                    <strong color="primary">2.5%</strong> (in TRX) rewards when anyone uses to deposit
                                </Typography>
                                <Typography gutterBottom
                                            style={{overflowWrap: "anywhere"}}
                                            variant="h6"
                                            color="textPrimary">
                                    {referralLink}
                                </Typography>
                                <CopyToClipboard
                                    onCopy={() => setCopied(true)}
                                    text={referralLink}>
                                    <Button variant="outlined" color="primary">Copy to clipboard</Button>
                                </CopyToClipboard>
                            </CardContent>
                        </Card>
                    </Grid>
                    {props.displayContractAddress && (
                        <Grid item xs={12} lg={4}>
                            <CardContractAddress contractAddress={props.contractAddress} />
                        </Grid>
                    )}
                    {props.referralCount > 0 && (
                        <Grid item xs={12} lg={4}>
                            <Card style={{height: "100%"}}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5">Earned TRX:</Typography>
                                    <Typography gutterBottom variant="h3"
                                                color="secondary"><CountUp end={props.earnedReferral} decimals={2} /></Typography>
                                    <Typography>From {props.referralCount} Referral{props.referralCount > 1 ? 's' : ''}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            )}
            <Snackbar
                open={copied}
                onClose={() => setCopied(false)}
                autoHideDuration={2000}
            >
                <Alert severity="success">Referral link copied</Alert>
            </Snackbar>
        </Box>
    );
}

export default ReferralLink;
