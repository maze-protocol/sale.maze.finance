import React from "react";
import {Box, Container, Grid} from "@material-ui/core";
import {Skeleton} from "@material-ui/lab";

const Header = props => {

    return (
        <Box>
            <Container>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center">
                    <h1><a href="https://maze.finance"><img src="logo-wide.png"  alt="Logo" /></a></h1>
                    <h4>{props.address ? `${props.accountName}: ${props.address}` : (<Skeleton variant="text" width="100px" /> )}</h4>
                </Grid>
            </Container>
        </Box>
    );
}

export default Header;
