import MazeToken from './contracts/MazeToken.json';
import MazePresaleTimer from './contracts/MazePresaleTimer.json';
import MazePresale from './contracts/MazePresale.json';
import MazeStakingVote from './contracts/MazeStakingVote.json';

// Default: development from trontools/quickstart docker image
// @see https://hub.docker.com/r/trontools/quickstart
const networkID = process.env.REACT_APP_NETWORK_ID || "9";
const privateKey = process.env.REACT_APP_PRIVATE_KEY || "da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0";


const networkOptions = {
    "1": { //Mainnet
        fullNode: "https://api.trongrid.io",
        solidityNode: "https://api.trongrid.io",
        eventServer: "https://api.trongrid.io",
        sideOptions: {
            fullNode: '',
            solidityNode: '',
            eventServer: '',
            mainGatewayAddress: '',
            sideGatewayAddress: '',
            sideChainId: ''
        }
    },
    "2": { //Shasta testnet
        fullNode: "https://api.shasta.trongrid.io",
        solidityNode: "https://api.shasta.trongrid.io",
        eventServer: "https://api.shasta.trongrid.io",
        sideOptions: {
            fullNode: '',
            solidityNode: '',
            eventServer: '',
            mainGatewayAddress: '',
            sideGatewayAddress: '',
            sideChainId: ''
        }
    },
    "9": { //trontools/quickstart
        fullNode: "http://127.0.0.1:9090",
        solidityNode: "http://127.0.0.1:9090",
        eventServer: "http://127.0.0.1:9090",
        sideOptions: {
            fullNode: '',
            solidityNode: '',
            eventServer: '',
            mainGatewayAddress: '',
            sideGatewayAddress: '',
            sideChainId: ''
        }
    }
}

const config = {
    mazeToken: {
        abi: MazeToken["abi"],
        address: MazeToken["networks"][networkID]["address"]
    },
    mazeTimer: {
        abi: MazePresaleTimer["abi"],
        address: MazePresaleTimer["networks"][networkID]["address"]
    },
    mazePresale: {
        abi: MazePresale["abi"],
        address: MazePresale["networks"][networkID]["address"]
    },
    mazeStakingVote: {
        abi: MazeStakingVote["abi"],
        address: MazeStakingVote["networks"][networkID]["address"]
    },
    tronWebOptions: {
        ...networkOptions[networkID],
        privateKey
    },
    networkID
}

export default config;
