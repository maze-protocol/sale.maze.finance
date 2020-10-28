import React from "react";
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import CountUp from "react-countup";
import CardContractAddress from "./CardContractAddress";

const Boxes = props => {
    const contractFullWidth = !props.tronLinkLoggedIn && props.hasSentToJustswap;
    return (
                <Grid
                    spacing={3}
                    alignItems="stretch"
                    container>
                    <Grid
                        item xs={12}
                        md={contractFullWidth ? 12 : 6}
                        lg={contractFullWidth ? 12 : 4}>
                        <CardContractAddress contractAddress={props.contractAddress} />
                    </Grid>
                    {props.tronLinkLoggedIn && (<Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5">Your TRX Deposit:</Typography>
                                <Typography variant="h3" color="secondary">
                                    <CountUp end={props.userTrx} decimals={2} />
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>)}
                    {props.tronLinkLoggedIn && (<Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5">Your MAZE Tokens:</Typography>
                                <Typography variant="h3" color="secondary">
                                    <CountUp end={props.userTokens} decimals={2} />
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>)}
                    {!props.hasSentToJustswap && (<Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5">Total Depositors:</Typography>
                                <Typography variant="h3" color="secondary">
                                    <CountUp end={props.depositorsCount} />
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>)}
                    {!props.hasSentToJustswap && (<Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5">Total TRX Deposited:</Typography>
                                <Typography variant="h3" color="secondary">
                                    <CountUp end={props.totalTrx} decimals={2} />
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>)}
                    {props.tronLinkLoggedIn && !props.hasSentToJustswap && (<Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5">Total Presale MAZE:</Typography>
                                <Typography variant="h3" color="secondary">
                                    <CountUp end={props.totalTokens} decimals={2} />
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>)}
                </Grid>
    );
}

export default Boxes;
