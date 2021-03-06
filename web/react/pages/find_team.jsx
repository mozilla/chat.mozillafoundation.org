// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import FindTeam from '../components/find_team.jsx';

function setupFindTeamPage() {
    ReactDOM.render(
        <FindTeam />,
        document.getElementById('find-team')
    );
}

global.window.setup_find_team_page = setupFindTeamPage;
