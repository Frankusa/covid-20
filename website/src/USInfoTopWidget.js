import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { myShortNumber } from "./Util.js";
import { withRouter } from 'react-router-dom'
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles(theme => ({
    tagSticky: {
        backgroundColor: "#FFFFFF",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: "1",
    },
    tagContainer: {
        padding: theme.spacing(1, 1, 0, 1),
        justifyContent: "space-between",
        display: "flex",
        flexWrap: "wrap",
        // margin: '24px 0',
    },
    tagContainerNoBeds: {
        flexWrap: "nowrap",
    },
    row: {
        padding: theme.spacing(1, 1),
        justifyContent: "space-between",
        display: "flex",
    },
    rowNoBeds: {
        justifyContent: "center",
    },
    tag: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        textAlign: "center",
        backgroundColor: "#f3f3f3",
        borderRadius: 10,
        flexGrow: "1",
        margin: 3,
        color: "black",
        textDecoration: "none",
    },
    summary_section: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        textAlign: "center",
        backgroundColor: "#f3f3f3",
        // borderRadius: 10,
        flexGrow: "1",
        margin: 0,
        color: "black",
        textDecoration: "none",
    },
    tagSelected: {
        color: "#FFFFFF",
        backgroundColor: "#00aeef",
    },
    tagTitle: {
        marginTop: 5,
    },
    tagSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "flex-end",
    },
    topTag: {
        fontSize: "0.5rem",
    },
    smallTag: {
        fontSize: "0.5rem",
    },
    mainTag: {
        fontSize: "1.0rem",
    },
    grow: {
        flexGrow: 1,
    },
    table: {
        width: "100%"
    },
    timestamp: {
        // fontWeight: "bold",
        padding: theme.spacing(0, 1),
        textAlign: "left",
    },
    sectionHeader: {
        "border-left": ".1rem solid #f50057",
        margin: 3,
        padding: 3,
    }
}));


const USInfoTopWidget = withRouter((props) => {
    const county = props.county;
    const metro = county.metro();
    const state = county.state();
    const country = state.country();

    const [notMetro] = React.useState(!metro)
    const [showDeaths] = React.useState(false)
    const [showRecovered] = React.useState(false)

    const theme = useTheme();
    const downXS = useMediaQuery(theme.breakpoints.down('xs'));
    const showBeds = notMetro && !downXS;

    const classes = useStyles();

    const county_hospitals = (county && county.hospitals()) || {
        'bedCount': "N/A",
        'count': "N/A",
    };
    const county_summary = county ? county.summary() : undefined;

    const metro_hospitals = metro ? metro.hospitals() : undefined;

    const state_title = showBeds ? state.name : state.twoLetterName;
    const state_hospitals = state.hospitals();
    const state_summary = state.summary();
    const us_summary = country.summary();

    return <div className={classes.tagSticky} >
        <div className={`${classes.tagContainer} ${showBeds ? '' : classes.tagContainerNoBeds}`} >
            {county &&
                <Tag
                    title={county.name}
                    confirmed={county_summary.confirmed}
                    newcases={county_summary.newcases}
                    hospitals={county_hospitals.count}
                    beds={county_hospitals.bedCount}
                    selected={props.selectedTab === "county"}
                    to={county.routeTo()}
                    showBeds={showBeds}
                />
            }
            {metro &&
                <Tag
                    title={metro.name}
                    confirmed={metro.summary().LastConfirmed}
                    newcases={metro.summary().LastConfirmedNew}
                    selected={props.selectedTab === "metro"}
                    to={metro.routeTo()}
                    /* hardcoded to bay area */
                    hospitals={metro_hospitals.count}
                    beds={metro_hospitals.bedCount}
                    showBeds={showBeds}
                />
            }
            <Tag title={state_title}
                confirmed={state_summary.confirmed}
                newcases={state_summary.newcases}
                deaths={state_summary.deaths}
                deathsNew={state_summary.deathsNew}
                recovered={state_summary.recovered}
                recoveredNew={state_summary.recoveredNew}
                hospitals={state_hospitals.count}
                beds={state_hospitals.bedCount}
                selected={props.selectedTab === "state"}
                to={state.routeTo()}
                showBeds={showBeds}
                // showRecovered={showRecovered}
                // showDeaths={showDeaths}
                showRecovered={false}
                showDeaths={false}
            />
            <Tag
                title={country.name}
                confirmed={us_summary.confirmed}
                newcases={us_summary.newcases}
                deaths={us_summary.deaths}
                deathsNew={us_summary.deathsNew}
                recovered={us_summary.recovered}
                recoveredNew={us_summary.recoveredNew}
                hospitals={6146}
                beds={924107}
                selected={props.selectedTab === "usa"}
                to={country.routeTo()}
                showBeds={showBeds}
                showRecovered={showRecovered}
                showDeaths={showDeaths}
            />
        </div>
    </div >;
});

const Tag = withRouter((props) => {
    const params = new URLSearchParams(props.history.location.search);
    const to = props.to + "?" + params.toString();
    const classes = useStyles();
    return <Link className={`${classes.tag} ${props.selected ? classes.tagSelected : ''}`} to={to}>
        <div className={classes.tagTitle}> {props.title} </div>
        <div className={`${classes.row} ${props.showBeds ? '' : classes.rowNoBeds}`} >
            <section className={classes.tagSection}>
                <div className={classes.topTag}>
                    +{myShortNumber(props.newcases)}
                </div>
                <div className={classes.mainTag}>
                    {myShortNumber(props.confirmed)} </div>
                <div className={classes.smallTag}>
                    Confirmed </div>
            </section>

            {props.showBeds && <section className={classes.tagSection}>
                <Typography className={classes.topTag} variant="body2" noWrap >
                    {myShortNumber(props.hospitals)} Hosp.
                </Typography>
                <div className={classes.mainTag}>
                    {myShortNumber(props.beds)}</div>
                <div className={classes.smallTag}>
                    Beds
                </div>
            </section>}
        </div>
    </Link>;
});

export {
    USInfoTopWidget,
    Tag,
}
