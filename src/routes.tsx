import React  from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import OrphanagesMap from './pages/OrphanagesMap';
import Orphanage from './pages/Orphanage';
import CreateOrphanage from './pages/CreateOrphanage';

function Routes() {
    return (

        <BrowserRouter>
            <Switch>
                {/* Exact tem como função comprar as paginas para que nao misture as paginas */}
                <Route path="/" exact component={Landing} />
                <Route path="/app" component={OrphanagesMap} />

                <Route path="/orphanages/create" component={CreateOrphanage} />
                <Route path="/orphanage/:id" component={Orphanage} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;