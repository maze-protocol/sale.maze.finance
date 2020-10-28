import React, {useState, useEffect} from "react";
import './App.css';
import {Box, Button, Backdrop, CircularProgress, Container, CssBaseline, Grid, Link,
    LinearProgress,
    Snackbar, Typography} from "@material-ui/core";
import {Alert, AlertTitle} from "@material-ui/lab";
import Header from "./components/Header";
import ReferralLink from "./components/ReferralLink";
import Deposit from "./components/Deposit";
import config from "./config";
import Boxes from "./components/Boxes";
import Countdown from "./components/Countdown";
import Vote from "./components/Vote";
import AfterFinish from "./components/AfterFinish";
import CardContractAddress from "./components/CardContractAddress";
import BigNumber from "bignumber.js";
import {Lock} from "./helpers/Lock";
import Claim from "./components/Claim";
import CardBox from "./components/CardBox";
import Footer from "./components/Footer";
const TronWeb = require("tronweb");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const getTronWeb = async () => {
    for(let i = 0; i < 15; i++) {
        if (!!window.tronWeb && window.tronWeb.ready) {
            window.tronWeb.isInjected = true;
            return window.tronWeb;
        }
        await sleep(100);
    }
    const tronWeb = new TronWeb(
        config.tronWebOptions.fullNode,
        config.tronWebOptions.solidityNode,
        config.tronWebOptions.eventServer,
        config.tronWebOptions.sideOptions,
        config.tronWebOptions.privateKey
    );
    tronWeb.isInjected = false;
    return tronWeb;
}
const BN = bn => BigNumber.isBigNumber(bn) ? new BigNumber(bn.toString()) : new BigNumber(bn);
const toToken = (value, decimals) => BN(value).dividedBy(BN(10).pow(decimals));
const toTrx = value => toToken(value, 6);
const toMaze = value => toToken(value, 18);
const UTCTimestampToDate = timestamp => {
    const result = new Date(0);
    result.setUTCSeconds(timestamp);
    return result;
}

function App() {

    const [tronWeb, setTronWeb] = useState(null);
    const [tronLinkInstalled, setTronLinkInstalled] = useState(!!window.tronWeb);
    const [tronLinkLoggedIn, setTronLinkLoggedIn] = useState(window.tronWeb && window.tronWeb.ready);
    const [address, setAddress] = useState((window.tronWeb && window.tronWeb.ready) ? window.tronWeb.defaultAddress.base58 : null);

    const [tokenContract, setTokenContract] = useState(null);
    const [presaleContract, setPresaleContract] = useState(null);
    const [timerContract, setTimerContract] = useState(null);
    const [voteContract, setVoteContract] = useState(null);

    const [totalTokens, setTotalTokens] = useState(BN(0));
    const [minimumDeposit, setMinimumDeposit] = useState(BN(0));
    const [maximumDeposit, setMaximumDeposit] = useState(BN(0));

    const [totalTrx, setTotalTrx] = useState(BN(0));
    const [userTokens, setUserTokens] = useState(BN(0));
    const [userTrx, setUserTrx] = useState(BN(0));
    const [depositorsCount, setDepositorsCount] = useState(BN(0));
    const [startTime, setStartTime] = useState(new Date(0))
    const [endTime, setEndTime] = useState(new Date(0));
    const [earnedReferral, setEearnedReferral] = useState(BN(0));
    const [referralCount, setRreferralCount] = useState(BN(0));
    const [isStarted, setIsStarted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const [burnCount, setBurnCount] = useState(BN(0));
    const [stakeMazeCount, setStakeMazeCount] = useState(BN(0));
    const [stakeMazeTrxCount, setStakeMazeTrxCount] = useState(BN(0));
    const [stakeMazeMultiCount, setStakeMazeMultiCount] = useState(BN(0));
    const [minimalVoteTrxDeposit, setMinimalVoteTrxDeposit] = useState(BN(0));
    const [votersCount, setVotersCount] = useState(BN(0));
    const [userVote, setUserVote] = useState(BN(0));
    const [hasSentToJustswap, setHasSentToJustswap] = useState(false);
    const [hasIssuedTokens, setHasIssuedTokens] = useState(false);
    const [hasSentTrx, setHasSentTrx] = useState(false);

    const [userRedeemable, setUserRedeemable] = useState(BN(0));
    const [userClaimed, setUserClaimed] = useState(BN(0));
    const [nextRedeemTime, setNextRedeemTime] = useState(BN(0));
    const [isBurned, setIsBurned] = useState(false);
    const [loading, setLoading] = useState(false);

    const [snackbarContent, setSnackbarContent] = useState('Page is loading. Wait a moment');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const fetchDataLock = Lock('fetchData');

    let referral = window.location.hash.match(/#\/referral\/([^\/]+)/);
    referral = referral ? referral[1] : '0x0';


    const setSnackbar = (content, severity = 'success') => {
        setSnackbarContent(content);
        setSnackbarSeverity(severity);
    }

    const fetchData = async (tronWeb, address, tokenContract, presaleContract, timerContract, voteContract) => {

        if (!tronWeb || !tokenContract || !presaleContract || !timerContract || !voteContract) {
            return false;
        }

        // Check if is before start
        const startTimestamp = BN(await timerContract.methods.startTime().call()).toNumber();
        const startTime = UTCTimestampToDate(startTimestamp);
        const isStarted = startTime.getTime() < Date.now();
        setStartTime(startTime);
        setIsStarted(isStarted);
        if (!isStarted) {
            return false;
        }


        const _totalTrx = await tronWeb.trx.getBalance(presaleContract.address);
        const totalTrx = toTrx(_totalTrx);

        const endTimestamp = BN(await timerContract.getEndTime(_totalTrx).call()).toNumber();

        const endTime = UTCTimestampToDate(endTimestamp);


        setEndTime(endTime);


        const isFinished = endTime.getTime() < Date.now();
        setIsFinished(isFinished);

        let hasSentToJustswap = false;

        if (isFinished) {
            hasSentToJustswap = await presaleContract.methods.hasSentToJustswap().call();
            const [
                hasIssuedTokens,
                hasSentTrx
            ] = [
                await presaleContract.methods.hasIssuedTokens().call(),
                await presaleContract.methods.hasSentTrx().call(),
            ]
            setHasSentToJustswap(hasSentToJustswap);
            setHasIssuedTokens(hasIssuedTokens);
            setHasSentTrx(hasSentTrx);
        }

        if (address) {
            setUserTrx(toTrx(await presaleContract.methods.depositAccounts(address).call()));
            setUserTokens(toMaze(await presaleContract.methods.accountEarnedMaze(address).call()));
            setEearnedReferral(toTrx(await presaleContract.methods.earnedReferrals(address).call()));
            setRreferralCount(BN(await presaleContract.methods.referralCounts(address).call()));
        }

        if (!hasSentToJustswap) {
            setDepositorsCount(BN(await presaleContract.methods.totalDepositors().call()));
            setTotalTrx(BN(totalTrx));
            setTotalTokens(toMaze(await presaleContract.methods.totalTokens().call()));
        }

        if (isStarted && !isFinished) {
            setMinimumDeposit(toTrx(await presaleContract.methods.minBuyPerAddress().call()));
            setMaximumDeposit(toTrx(await presaleContract.methods.maxBuyPerAddress().call()));
        }

        if (isStarted) {
            const [
                burnCount,
                stakeMazeCount,
                stakeMazeTrxCount,
                stakeMazeMultiCount,
                minimalVoteTrxDeposit,
                votersCount,
                isBurned
            ] = [
                BN(await voteContract.methods.burnCount().call()),
                BN(await voteContract.methods.stakeMazeCount().call()),
                BN(await voteContract.methods.stakeMazeTrxCount().call()),
                BN(await voteContract.methods.stakeMazeMultiCount().call()),
                toTrx(await voteContract.methods.minimalTrxDeposit().call()),
                BN(await voteContract.methods.votersCount().call()),
                await voteContract.methods.burned().call()
            ];

            setBurnCount(burnCount);
            setStakeMazeCount(stakeMazeCount);
            setStakeMazeTrxCount(stakeMazeTrxCount);
            setStakeMazeMultiCount(stakeMazeMultiCount);
            setMinimalVoteTrxDeposit(minimalVoteTrxDeposit);
            setVotersCount(votersCount);
            setIsBurned(isBurned);

            if (address) {
                const userVote = BN(await voteContract.methods.voters(address).call())
                setUserVote(userVote);
            }
        }

        if (hasSentToJustswap && address) {

            setUserRedeemable(toMaze(await presaleContract.methods.calculateRedeemable(address).call()));
            setUserClaimed(toMaze(await presaleContract.methods.accountClaimedMaze(address).call()));
            setNextRedeemTime(BN(await presaleContract.methods.finalEndTime().call())
                .plus(BN(3600).multipliedBy(50))
                .multipliedBy(1000)
                .minus(Date.now())
                .modulo(3600000)
                .integerValue());



        }
    }

    useEffect(() => {

        async function init() {

            if (!tronWeb) return;

            const tokenContract = await tronWeb.contract().at(config.mazeToken.address);
            const presaleContract = await tronWeb.contract().at(config.mazePresale.address);
            const timerContract = await tronWeb.contract().at(config.mazeTimer.address);
            const voteContract = await tronWeb.contract().at(config.mazeStakingVote.address)

            if (!tokenContract) return;
            if (!presaleContract) return;
            if (!timerContract) return;
            if (!voteContract) return;

            setTokenContract(tokenContract);
            setPresaleContract(presaleContract);
            setTimerContract(timerContract);
            setVoteContract(voteContract);

            await fetchData(tronWeb, address, tokenContract, presaleContract, timerContract, voteContract);

            if (fetchDataLock.isLocked()) {
                return false;
            }
            fetchDataLock.lock(1000);

            const interval = setInterval(async () => {
                try {
                    if ((await getTronWeb()).isInjected !== tronWeb.isInjected)
                    {
                        return setAddress(false);
                    }
                    if (tronWeb.isInjected && (address !== tronWeb.defaultAddress.base58))
                    {
                        if (address) {
                            await setAddress(tronWeb.defaultAddress.base58);
                            window.location.reload();
                        }
                        await setAddress(tronWeb.defaultAddress.base58);
                    }
                    await fetchData(tronWeb, address, tokenContract, presaleContract, timerContract, voteContract);
                } catch {
                    window.location.reload();
                }
            }, 5000);
            return () => clearInterval(interval)
        }

        init();

    }, [address, tronLinkLoggedIn, tronWeb]);

    const onConnect = async () => {
        const tronWeb = await getTronWeb();
        setTronWeb(tronWeb);
        if (tronWeb.isInjected) {
            setTronLinkInstalled(!!window.tronWeb);
            setTronLinkLoggedIn(window.tronWeb && window.tronWeb.ready)
            if (address && (window.tronWeb && window.tronWeb.ready) && address !== tronWeb.defaultAddress.base58) {
                await setAddress(tronWeb.defaultAddress.base58);
                window.location.reload();
            }
            setAddress((window.tronWeb && window.tronWeb.ready) ? tronWeb.defaultAddress.base58 : false);
        } else {
            setTronLinkInstalled(false);
            setTronLinkLoggedIn(false)
            setAddress(false);
        }
    }

    useEffect(() => {
        onConnect();
    }, [address, tronLinkLoggedIn])

    const handleDeposit = async value => {
        setLoading(true);
        try {
            await presaleContract.methods.deposit(tronWeb.isAddress(referral) ? referral : address).send({
                // from: address,
                callValue: tronWeb.toSun(value),
                shouldPollResponse: true
            })
            setSnackbar("Your Deposit has been received", "success")
        } catch (err) {
            setSnackbar(err.error, "error")
        }
        setLoading(false);
    }

    const handleVote = async value => {
        setLoading(true);
        try {
            await voteContract.methods.vote(value).send({
                shouldPollResponse: true
            });
            setSnackbar("Voted!!!", "success")
        } catch {
            setSnackbar("Vote error", "error")
        }
        setLoading(false);
    }

    const handleSendToJustswap = async () => {
        setLoading(true);
        try {
            // @test - no JustSwap on test net uncomment below code to test whole presale
            // await presaleContract.methods.testSendToJustswap(address).send({
            //     shouldPollResponse: true
            // });
            // @test - comment code below
            await presaleContract.methods.sendToJustswap().send({
                shouldPollResponse: true
            });
            setSnackbar("Sent to JustSwap", "success");
        } catch {
            setSnackbar("Send to JustSwap Error", "error");
        }
        setLoading(false);
    }
    const handleIssueTokens = async () => {
        setLoading(true);
        try {
            await presaleContract.methods.issueTokens().send({
                shouldPollResponse: true
            });
            setSnackbar("Tokens has been issued", "success");
        } catch {
            setSnackbar("Issue Tokens Error", "error");
        }
        setLoading(false);
    }
    const handleSendTrx = async () => {
        setLoading(true);
        try {
            await presaleContract.methods.sendTrx().send({
                shouldPollResponse: true
            });
            setSnackbar("TRX has been sent", "success");
        } catch {
            setSnackbar("TRX Sending Error", "error");
        }
        setLoading(false);
    }
    const handleRedeem = async (num) => {
        setLoading(true);
        try {
            await presaleContract.methods.redeem().send({
                shouldPollResponse: true
            });
            setSnackbar(`${num} MAZE claimed`, "success");
        } catch {
            setSnackbar("Claim error. Try Again", "error");
        }
        setLoading(false);
    }

    const handleBurn = async (num) => {
        setLoading(true);
        try {
            await voteContract.methods.burn().send({
                shouldPollResponse: true
            });
            setSnackbar(`MAZE Tokens Burned`, "success");
        } catch {
            setSnackbar("Burn error", "error");
        }
        setLoading(false);
    }


    return tronWeb ? (
        <Box style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <CssBaseline/>
            {loading && (<LinearProgress color="secondary" style={{position: "fixed", top: 0, left: 0, right: 0}} />)}
            <Header
                address={address}
                accountName={address? tronWeb.defaultAddress.name : false}
            />
            <Container>
                {!isFinished && tronLinkInstalled && !tronLinkLoggedIn && (
                    <Alert severity="warning" style={{marginBottom: 20}}>
                        <AlertTitle>Warning</AlertTitle>
                        Please log into your TronLink Wallet to participate in the presale.
                    </Alert>
                )}
                {!isFinished && !tronLinkInstalled && (<Alert severity="warning" style={{marginBottom: 20}}>
                    <AlertTitle>Warning</AlertTitle>
                    Please install <Link
                    href="https://www.tronlink.org/"
                    rel="noreferrer"
                    target="_blank">TronLink Wallet</Link> to participate in the presale.<br/>
                    <Link
                        href="https://chrome.google.com/webstore/detail/tronlink%EF%BC%88%E6%B3%A2%E5%AE%9D%E9%92%B1%E5%8C%85%EF%BC%89/ibnejdfjmmkpcnlpebklmnkoeoihofec"
                        rel="noreferrer"
                        target="_blank">TronLink Chrome/Brave Extension</Link>
                </Alert>)}
            </Container>
            <Container>
                <Grid container spacing={3}>
                    {isStarted && (<Grid item xs={12}>
                        <Boxes
                            contractAddress={tronWeb.address.fromHex(config.mazePresale.address)}
                            totalTrx={totalTrx.toNumber()}
                            totalTokens={totalTokens.toNumber()}
                            userTrx={userTrx.toNumber()}
                            userTokens={userTokens.toNumber()}
                            depositorsCount={depositorsCount.toNumber()}
                            isStarted={isStarted}
                            isFinished={isFinished}
                            tronLinkLoggedIn={tronLinkLoggedIn}
                            hasSentToJustswap={hasSentToJustswap}
                        ></Boxes>
                    </Grid>)}
                    {!isStarted && startTime.getTime() > 0 && (
                        <Grid item xs={12}>
                            <Countdown title="MAZE Presale starts in"
                                       initialTime={startTime.getTime() - Date.now()}/>
                        </Grid>)}
                    {isStarted && (
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={8}>
                                    {!isFinished ? (
                                        <Grid container spacing={3} style={{
                                            height: "calc(100% + 24px)",
                                            flexDirection: "column"
                                        }}>
                                            <Grid item xs={12}
                                                  style={{flex: tronLinkLoggedIn ? "0 1 auto" : "1 1 auto"}}>
                                                <Countdown title="MAZE Presale ends in"
                                                           initialTime={endTime.getTime() - Date.now()}/>
                                            </Grid>
                                            {tronLinkLoggedIn && (<Grid item xs={12} style={{flex: "1 1 auto"}}>
                                                <Deposit
                                                    height="100%"
                                                    handler={handleDeposit}
                                                    minimum={tronWeb.BigNumber.max(0, minimumDeposit.minus(userTrx)).integerValue(3).toNumber()}
                                                    maximum={maximumDeposit.minus(userTrx).integerValue(3).toNumber()}/>
                                            </Grid>)}
                                        </Grid>
                                    ) : (
                                        <Grid container spacing={3} style={{
                                            height: "calc(100% + 24px)",
                                            flexDirection: "column"
                                        }}>
                                            {tronLinkLoggedIn  && (
                                                <Grid item xs={12}
                                                      style={{flex: "0 1 auto"}}>
                                                    {hasSentToJustswap ? (
                                                        <Claim
                                                            userTokens={userTokens.toNumber()}
                                                            userRedeemable={userRedeemable.toNumber()}
                                                            userClaimed={userClaimed.toNumber()}
                                                            nextRedeemTime={nextRedeemTime.toNumber()}
                                                            handleRedeem={handleRedeem}
                                                        />
                                                    ) : (
                                                        <CardBox>
                                                            <Button
                                                                onClick={handleSendToJustswap}
                                                                variant="outlined"
                                                                color="secondary"
                                                                size="large"
                                                            >Send To JustSwap (create liquidity pool)</Button>
                                                        </CardBox>
                                                    )}
                                                </Grid>
                                            )}
                                            <Grid item xs={12} style={{flex: "1 1 auto"}}>
                                                <CardContractAddress
                                                    title="MAZE Token Smart Contract"
                                                    contractAddress={tronWeb.address.fromHex(config.mazeToken.address)}
                                                >
                                                    <Typography style={{fontSize: 12, marginTop: 12}}>
                                                        To add MAZE to Your TronLink Wallet, copy above address.
                                                    </Typography>
                                                    <Typography style={{fontSize: 12, marginTop: 6}}>
                                                        Open TronLink, choose "Asset Management" from menu and paste
                                                        copied address into input field. Enable result. MAZE is added.
                                                    </Typography>
                                                </CardContractAddress>
                                            </Grid>
                                        </Grid>
                                    )}

                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Vote
                                        isFinished={isFinished}
                                        stakeMazeCount={stakeMazeCount.toNumber()}
                                        stakeMazeTrxCount={stakeMazeTrxCount.toNumber()}
                                        stakeMazeMultiCount={stakeMazeMultiCount.toNumber()}
                                        burnCount={burnCount.toNumber()}
                                        votersCount={votersCount.toNumber()}
                                        value={userVote.toString()}
                                        handleVote={handleVote}
                                        userTrx={userTrx.toNumber()}
                                        minimalTrxDeposit={minimalVoteTrxDeposit.integerValue(2).toNumber()}
                                        tronLinkLoggedIn={tronLinkLoggedIn}
                                        canBurn={hasSentToJustswap && hasSentTrx && hasIssuedTokens}
                                        isBurned={isBurned}
                                        handleBurn={handleBurn}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                    {!isFinished && (
                        <Grid item xs={12}>
                            {tronLinkLoggedIn && (<ReferralLink
                                displayContractAddress={!isStarted}
                                contractAddress={tronWeb.address.fromHex(config.mazePresale.address)}
                                referralCount={parseInt(referralCount.toString())}
                                earnedReferral={earnedReferral.toNumber()}
                                address={address}></ReferralLink>)}
                            {!tronLinkLoggedIn && !isStarted && (<CardContractAddress
                                contractAddress={tronWeb.address.fromHex(config.mazePresale.address)}
                            />)}
                        </Grid>
                    )}
                    {isFinished && tronLinkLoggedIn && (!hasSentToJustswap || !hasIssuedTokens || !hasSentTrx) && (
                        <Grid item xs={12}><AfterFinish
                            hasSentToJustswap={hasSentToJustswap}
                            handleSendToJustswap={handleSendToJustswap}
                            hasIssuedTokens={hasIssuedTokens}
                            handleIssueTokens={handleIssueTokens}
                            hasSentTrx={hasSentTrx}
                            handleSendTrx={handleSendTrx}
                        /></Grid>
                    )}
                </Grid>
            </Container>
            <Footer></Footer>
            <Snackbar
                open={snackbarContent.length > 0}
                onClose={() => setSnackbarContent('')}
                autoHideDuration={4000}
            >
                <Alert severity={snackbarSeverity}>{snackbarContent}</Alert>
            </Snackbar>
        </Box>
    ) : (<Backdrop open>
        <CircularProgress color="inherit" />
    </Backdrop>);
}

export default App;
