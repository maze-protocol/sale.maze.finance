import React from "react";
import {Box, Container, Grid, Link, Typography} from "@material-ui/core";
import { Email, GitHub, Telegram, Twitter } from "@material-ui/icons";


const Footer = props => (
    <Box style={{
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
    }}>
        <Box style={{
            marginTop: 30,
            paddingTop: 20,
            paddingBottom: 20,
            color: 'rgba(0, 0, 0, .3)',
        }}>
            <Container>
                <Grid container>
                    <Grid item xs={12}>
                        <Box style={{display: 'flex', justifyContent: 'center'}}>
                            <Box style={{display: 'flex', justifyContent: 'space-between', width: 180}}>
                                <Link href="https://maze.finance"><img src="logo-black.png" style={{width: 24, height: 24, opacity: .26}}/></Link>
                                <Link href="mailto:team@maze.finance"><Email color="disabled"/></Link>
                                <Link href="http://twitter.com/maze_protocol"><Twitter color="disabled"/></Link>
                                <Link href="https://github.com/maze-protocol"><GitHub color="disabled"/></Link>
                                <Link href="https://t.me/MAZEOfficial"><Telegram color="disabled"/></Link>
                            </Box>
                        </Box>
                        <Box style={{
                            width: '75%',
                            height: 1,
                            backgroundColor: 'rgba(0,0,0,.12)',
                            display: 'block',
                            margin: '20px auto'
                        }}></Box>
                        <Typography align="center" gutterBottom style={{fontSize: '1.1rem'}}>Legal
                            Disclaimer</Typography>
                        <Typography align="center" gutterBottom style={{fontSize: '.8rem'}}>The information provided on
                            this website does not constitute investment advice, financial advice, trading advice, or any
                            other sort of advice and you should not treat any of the website's content as such.
                            Maze Team does not recommend that any cryptocurrency should be bought, sold, or held by
                            you. Do conduct your own due diligence and consult your financial advisor before making any
                            investment decisions.</Typography>
                        <Typography align="center" gutterBottom style={{fontSize: '.8rem'}}>By purchasing MAZE , you
                            agree that you are not purchasing a security or investment and you agree to hold the team
                            harmless and not liable for any losses or taxes you may incur. You also agree that the team
                            is presenting the token “as is” and is not legally required to provide any support or
                            services. You should have no expectation of any form from MAZE and its team.</Typography>
                        <Typography align="center" gutterBottom style={{fontSize: '.8rem'}}>Always make sure that you
                            are in compliance with your local laws and regulations before you make any
                            purchase.</Typography>

                        <Typography style={{fontSize: '.9rem', marginTop: 20}} align="center">
                            © 2020 MAZE Team. All rights reserved.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </Box>
)

export default Footer;
