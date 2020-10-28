import React from "react";
import {Box, Link} from "@material-ui/core";
import CardBox from "./CardBox";


const CardContractAddress = props => {
    return (<CardBox title={props.title || 'Presale Contract Address:'}>
            <Link
                target='_blank'
                href={`https://tronscan.org/#/contract/${props.contractAddress}`}
            >{props.contractAddress}</Link>
        <Box>{props.children}</Box>
    </CardBox>)
}

export default CardContractAddress;
