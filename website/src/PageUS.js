import React, { useContext } from 'react';
import { CountryContext } from "./CountryContext";
import { withHeader } from "./Header.js"
import { MyTabs } from "./MyTabs.js"
import * as Util from "./Util.js"
import { USInfoTopWidget } from './USInfoTopWidget.js'
import { GraphSection } from './graphs/Graphs';
import {
    ListAllStates,
    ListAllStatesPerCapita,
    ListAllStatesTesting,
} from "./ListAllStates.js"
import { logger } from "./AppModule"
import { Title } from './Title';

const PageUS = withHeader((props) => {
    const country = useContext(CountryContext);

    const default_county_info = Util.getDefaultCounty();
    const state = country.stateForTwoLetterName(default_county_info.state);
    const county = state.countyForName(default_county_info.county)
    logger.logEvent("PageUS");

    const tabs = [
        <ListAllStates country={country} />,
        <ListAllStatesTesting country={country} />,
        <ListAllStatesPerCapita country={country} />,
    ];

    return (
        <>
            <Title
                title={country.longName}
                desc={`${country.longName} county-level COVID-19 30-day data visualized: `
                          + `confirmed cases, new cases & death curves, `
                          + `testing results & hospitalization numbers.`}
            />
            <USInfoTopWidget county={county} selectedTab={"usa"} />
            <GraphSection source={country} />
            <MyTabs
                labels={["States of USA", "Testing", "Capita"]}
                urlQueryKey="table"
                urlQueryValues={['cases', 'testing', 'capita']}
                tabs={tabs}
            />
        </>
    );
});

export { PageUS }
