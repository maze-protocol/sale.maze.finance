import React, {useState} from "react";
import {Box, Button, Card, CardContent, TextField, Typography} from "@material-ui/core";


const Deposit = props => {

    const [value, setValue] = useState("");
    const [invalid, setInvalid] = useState(false);
    const minimum = props.minimum;
    const maximum = props.maximum;

    const handle = () => {
        setInvalid(false);
        if (minimum <= value && value <= maximum)
        {
            return props.handler(value);
        }
        setInvalid(true);
    }

    return (<Box style={{height: "100%"}}>
        <Card style={{height: "100%"}}>
            <CardContent>
                <Typography align="center" variant="h4" gutterBottom>Deposit TRX for MAZE</Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Box flexGrow={1} mr={1}>
                        <TextField
                            fullWidth
                            value={value}
                            error={invalid}
                            min={minimum}
                            max={maximum}
                            type="number"
                            size="medium"
                            variant="outlined"
                            onChange={e => {
                                setValue(e.target.value);
                                if (parseInt(e.target.value) >= minimum) {
                                    setInvalid(false);
                                }
                            }}
                        ></TextField>
                    </Box>
                    <Box>
                        <Button onClick={handle}
                                variant="contained"
                                color="secondary"
                                size="large">Deposit</Button>
                    </Box>
                </Box>
                <Typography color={invalid ? "error" : "initial"}>
                    Please insert value between <strong>{minimum}</strong> and <strong>{maximum}</strong> TRX.
                </Typography>
            </CardContent>
        </Card>
    </Box>)
}

export default Deposit;
