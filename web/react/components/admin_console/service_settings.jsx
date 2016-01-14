// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import * as Client from '../../utils/client.jsx';
import * as AsyncClient from '../../utils/async_client.jsx';

const DefaultSessionLength = 30;
const DefaultMaximumLoginAttempts = 10;
const DefaultSessionCacheInMinutes = 10;

export default class ServiceSettings extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            saveNeeded: false,
            serverError: null
        };
    }

    handleChange() {
        var s = {saveNeeded: true, serverError: this.state.serverError};
        this.setState(s);
    }

    handleSubmit(e) {
        e.preventDefault();
        $('#save-button').button('loading');

        var config = this.props.config;
        config.ServiceSettings.ListenAddress = ReactDOM.findDOMNode(this.refs.ListenAddress).value.trim();
        if (config.ServiceSettings.ListenAddress === '') {
            config.ServiceSettings.ListenAddress = ':8065';
            ReactDOM.findDOMNode(this.refs.ListenAddress).value = config.ServiceSettings.ListenAddress;
        }

        config.ServiceSettings.SegmentDeveloperKey = ReactDOM.findDOMNode(this.refs.SegmentDeveloperKey).value.trim();
        config.ServiceSettings.GoogleDeveloperKey = ReactDOM.findDOMNode(this.refs.GoogleDeveloperKey).value.trim();
        config.ServiceSettings.EnableIncomingWebhooks = ReactDOM.findDOMNode(this.refs.EnableIncomingWebhooks).checked;
        config.ServiceSettings.EnableOutgoingWebhooks = ReactDOM.findDOMNode(this.refs.EnableOutgoingWebhooks).checked;
        config.ServiceSettings.EnablePostUsernameOverride = ReactDOM.findDOMNode(this.refs.EnablePostUsernameOverride).checked;
        config.ServiceSettings.EnablePostIconOverride = ReactDOM.findDOMNode(this.refs.EnablePostIconOverride).checked;
        config.ServiceSettings.EnableTesting = ReactDOM.findDOMNode(this.refs.EnableTesting).checked;
        config.ServiceSettings.EnableDeveloper = ReactDOM.findDOMNode(this.refs.EnableDeveloper).checked;
        config.ServiceSettings.EnableSecurityFixAlert = ReactDOM.findDOMNode(this.refs.EnableSecurityFixAlert).checked;

        //config.ServiceSettings.EnableOAuthServiceProvider = ReactDOM.findDOMNode(this.refs.EnableOAuthServiceProvider).checked;

        var MaximumLoginAttempts = DefaultMaximumLoginAttempts;
        if (!isNaN(parseInt(ReactDOM.findDOMNode(this.refs.MaximumLoginAttempts).value, 10))) {
            MaximumLoginAttempts = parseInt(ReactDOM.findDOMNode(this.refs.MaximumLoginAttempts).value, 10);
        }
        if (MaximumLoginAttempts < 1) {
            MaximumLoginAttempts = 1;
        }
        config.ServiceSettings.MaximumLoginAttempts = MaximumLoginAttempts;
        ReactDOM.findDOMNode(this.refs.MaximumLoginAttempts).value = MaximumLoginAttempts;

        var SessionLengthWebInDays = DefaultSessionLength;
        if (!isNaN(parseInt(ReactDOM.findDOMNode(this.refs.SessionLengthWebInDays).value, 10))) {
            SessionLengthWebInDays = parseInt(ReactDOM.findDOMNode(this.refs.SessionLengthWebInDays).value, 10);
        }
        if (SessionLengthWebInDays < 1) {
            SessionLengthWebInDays = 1;
        }
        config.ServiceSettings.SessionLengthWebInDays = SessionLengthWebInDays;
        ReactDOM.findDOMNode(this.refs.SessionLengthWebInDays).value = SessionLengthWebInDays;

        var SessionLengthMobileInDays = DefaultSessionLength;
        if (!isNaN(parseInt(ReactDOM.findDOMNode(this.refs.SessionLengthMobileInDays).value, 10))) {
            SessionLengthMobileInDays = parseInt(ReactDOM.findDOMNode(this.refs.SessionLengthMobileInDays).value, 10);
        }
        if (SessionLengthMobileInDays < 1) {
            SessionLengthMobileInDays = 1;
        }
        config.ServiceSettings.SessionLengthMobileInDays = SessionLengthMobileInDays;
        ReactDOM.findDOMNode(this.refs.SessionLengthMobileInDays).value = SessionLengthMobileInDays;

        var SessionLengthSSOInDays = DefaultSessionLength;
        if (!isNaN(parseInt(ReactDOM.findDOMNode(this.refs.SessionLengthSSOInDays).value, 10))) {
            SessionLengthSSOInDays = parseInt(ReactDOM.findDOMNode(this.refs.SessionLengthSSOInDays).value, 10);
        }
        if (SessionLengthSSOInDays < 1) {
            SessionLengthSSOInDays = 1;
        }
        config.ServiceSettings.SessionLengthSSOInDays = SessionLengthSSOInDays;
        ReactDOM.findDOMNode(this.refs.SessionLengthSSOInDays).value = SessionLengthSSOInDays;

        var SessionCacheInMinutes = DefaultSessionCacheInMinutes;
        if (!isNaN(parseInt(ReactDOM.findDOMNode(this.refs.SessionCacheInMinutes).value, 10))) {
            SessionCacheInMinutes = parseInt(ReactDOM.findDOMNode(this.refs.SessionCacheInMinutes).value, 10);
        }
        if (SessionCacheInMinutes < -1) {
            SessionCacheInMinutes = -1;
        }
        config.ServiceSettings.SessionCacheInMinutes = SessionCacheInMinutes;
        ReactDOM.findDOMNode(this.refs.SessionCacheInMinutes).value = SessionCacheInMinutes;

        Client.saveConfig(
            config,
            () => {
                AsyncClient.getConfig();
                this.setState({
                    serverError: null,
                    saveNeeded: false
                });
                $('#save-button').button('reset');
            },
            (err) => {
                this.setState({
                    serverError: err.message,
                    saveNeeded: true
                });
                $('#save-button').button('reset');
            }
        );
    }

    render() {
        var serverError = '';
        if (this.state.serverError) {
            serverError = <div className='form-group has-error'><label className='control-label'>{this.state.serverError}</label></div>;
        }

        var saveClass = 'btn';
        if (this.state.saveNeeded) {
            saveClass = 'btn btn-primary';
        }

        return (
            <div className='wrapper--fixed'>

                <h3>{'Service Settings'}</h3>
                <form
                    className='form-horizontal'
                    role='form'
                >

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='ListenAddress'
                        >
                            {'Listen Address:'}
                        </label>
                        <div className='col-sm-8'>
                            <input
                                type='text'
                                className='form-control'
                                id='ListenAddress'
                                ref='ListenAddress'
                                placeholder='Ex ":8065"'
                                defaultValue={this.props.config.ServiceSettings.ListenAddress}
                                onChange={this.handleChange}
                            />
                            <p className='help-text'>{'The address to which to bind and listen. Entering ":8065" will bind to all interfaces or you can choose one like "127.0.0.1:8065".  Changing this will require a server restart before taking effect.'}</p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='MaximumLoginAttempts'
                        >
                            {'Maximum Login Attempts:'}
                        </label>
                        <div className='col-sm-8'>
                            <input
                                type='text'
                                className='form-control'
                                id='MaximumLoginAttempts'
                                ref='MaximumLoginAttempts'
                                placeholder='Ex "10"'
                                defaultValue={this.props.config.ServiceSettings.MaximumLoginAttempts}
                                onChange={this.handleChange}
                            />
                            <p className='help-text'>{'Login attempts allowed before user is locked out and required to reset password via email.'}</p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='SegmentDeveloperKey'
                        >
                            {'Segment Developer Key:'}
                        </label>
                        <div className='col-sm-8'>
                            <input
                                type='text'
                                className='form-control'
                                id='SegmentDeveloperKey'
                                ref='SegmentDeveloperKey'
                                placeholder='Ex "g3fgGOXJAQ43QV7rAh6iwQCkV4cA1Gs"'
                                defaultValue={this.props.config.ServiceSettings.SegmentDeveloperKey}
                                onChange={this.handleChange}
                            />
                            <p className='help-text'>{'For users running a SaaS services, sign up for a key at Segment.com to track metrics.'}</p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='GoogleDeveloperKey'
                        >
                            {'Google Developer Key:'}
                        </label>
                        <div className='col-sm-8'>
                            <input
                                type='text'
                                className='form-control'
                                id='GoogleDeveloperKey'
                                ref='GoogleDeveloperKey'
                                placeholder='Ex "7rAh6iwQCkV4cA1Gsg3fgGOXJAQ43QV"'
                                defaultValue={this.props.config.ServiceSettings.GoogleDeveloperKey}
                                onChange={this.handleChange}
                            />
                            <p className='help-text'>
                                {'Set this key to enable embedding of YouTube video previews based on hyperlinks appearing in messages or comments. Instructions to obtain a key available at '}
                                <a
                                    href='https://www.youtube.com/watch?v=Im69kzhpR3I'
                                    target='_blank'
                                >
                                    {'https://www.youtube.com/watch?v=Im69kzhpR3I'}
                                </a>
                                {'. Leaving the field blank disables the automatic generation of YouTube video previews from links.'}
                            </p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='EnableIncomingWebhooks'
                        >
                            {'Enable Incoming Webhooks: '}
                        </label>
                        <div className='col-sm-8'>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='EnableIncomingWebhooks'
                                    value='true'
                                    ref='EnableIncomingWebhooks'
                                    defaultChecked={this.props.config.ServiceSettings.EnableIncomingWebhooks}
                                    onChange={this.handleChange}
                                />
                                    {'true'}
                            </label>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='EnableIncomingWebhooks'
                                    value='false'
                                    defaultChecked={!this.props.config.ServiceSettings.EnableIncomingWebhooks}
                                    onChange={this.handleChange}
                                />
                                    {'false'}
                            </label>
                            <p className='help-text'>{'When true, incoming webhooks will be allowed. To help combat phishing attacks, all posts from webhooks will be labelled by a BOT tag.'}</p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='EnableOutgoingWebhooks'
                        >
                            {'Enable Outgoing Webhooks: '}
                        </label>
                        <div className='col-sm-8'>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='EnableOutgoingWebhooks'
                                    value='true'
                                    ref='EnableOutgoingWebhooks'
                                    defaultChecked={this.props.config.ServiceSettings.EnableOutgoingWebhooks}
                                    onChange={this.handleChange}
                                />
                                    {'true'}
                            </label>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='EnableOutgoingWebhooks'
                                    value='false'
                                    defaultChecked={!this.props.config.ServiceSettings.EnableOutgoingWebhooks}
                                    onChange={this.handleChange}
                                />
                                    {'false'}
                            </label>
                            <p className='help-text'>{'When true, outgoing webhooks will be allowed.'}</p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='EnablePostUsernameOverride'
                        >
                            {'Enable Overriding Usernames from Webhooks: '}
                        </label>
                        <div className='col-sm-8'>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='EnablePostUsernameOverride'
                                    value='true'
                                    ref='EnablePostUsernameOverride'
                                    defaultChecked={this.props.config.ServiceSettings.EnablePostUsernameOverride}
                                    onChange={this.handleChange}
                                />
                                    {'true'}
                            </label>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='EnablePostUsernameOverride'
                                    value='false'
                                    defaultChecked={!this.props.config.ServiceSettings.EnablePostUsernameOverride}
                                    onChange={this.handleChange}
                                />
                                    {'false'}
                            </label>
                            <p className='help-text'>{'When true, webhooks will be allowed to change the username they are posting as. Note, combined with allowing icon overriding, this could open users up to phishing attacks.'}</p>
                        </div>
                    </div>

                     <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='EnablePostIconOverride'
                        >
                            {'Enable Overriding Icon from Webhooks: '}
                        </label>
                        <div className='col-sm-8'>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='EnablePostIconOverride'
                                    value='true'
                                    ref='EnablePostIconOverride'
                                    defaultChecked={this.props.config.ServiceSettings.EnablePostIconOverride}
                                    onChange={this.handleChange}
                                />
                                    {'true'}
                            </label>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='EnablePostIconOverride'
                                    value='false'
                                    defaultChecked={!this.props.config.ServiceSettings.EnablePostIconOverride}
                                    onChange={this.handleChange}
                                />
                                    {'false'}
                            </label>
                            <p className='help-text'>{'When true, webhooks will be allowed to change the icon they post with. Note, combined with allowing username overriding, this could open users up to phishing attacks.'}</p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='EnableTesting'
                        >
                            {'Enable Testing: '}
                        </label>
                        <div className='col-sm-8'>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='EnableTesting'
                                    value='true'
                                    ref='EnableTesting'
                                    defaultChecked={this.props.config.ServiceSettings.EnableTesting}
                                    onChange={this.handleChange}
                                />
                                    {'true'}
                            </label>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='EnableTesting'
                                    value='false'
                                    defaultChecked={!this.props.config.ServiceSettings.EnableTesting}
                                    onChange={this.handleChange}
                                />
                                    {'false'}
                            </label>
                            <p className='help-text'>{'(Developer Option) When true, /loadtest slash command is enabled to load test accounts and test data. Changing this will require a server restart before taking effect.'}</p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='EnableDeveloper'
                        >
                            {'Enable Developer Mode: '}
                        </label>
                        <div className='col-sm-8'>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='EnableDeveloper'
                                    value='true'
                                    ref='EnableDeveloper'
                                    defaultChecked={this.props.config.ServiceSettings.EnableDeveloper}
                                    onChange={this.handleChange}
                                />
                                    {'true'}
                            </label>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='EnableDeveloper'
                                    value='false'
                                    defaultChecked={!this.props.config.ServiceSettings.EnableDeveloper}
                                    onChange={this.handleChange}
                                />
                                    {'false'}
                            </label>
                            <p className='help-text'>{'(Developer Option) When true, extra information around errors will be displayed in the UI.'}</p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='EnableSecurityFixAlert'
                        >
                            {'Enable Security Alerts: '}
                        </label>
                        <div className='col-sm-8'>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='EnableSecurityFixAlert'
                                    value='true'
                                    ref='EnableSecurityFixAlert'
                                    defaultChecked={this.props.config.ServiceSettings.EnableSecurityFixAlert}
                                    onChange={this.handleChange}
                                />
                                    {'true'}
                            </label>
                            <label className='radio-inline'>
                                <input
                                    type='radio'
                                    name='EnableSecurityFixAlert'
                                    value='false'
                                    defaultChecked={!this.props.config.ServiceSettings.EnableSecurityFixAlert}
                                    onChange={this.handleChange}
                                />
                                    {'false'}
                            </label>
                            <p className='help-text'>{'When true, System Administrators are notified by email if a relevant security fix alert has been announced in the last 12 hours. Requires email to be enabled.'}</p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='SessionLengthWebInDays'
                        >
                            {'Session Length for Web in Days:'}
                        </label>
                        <div className='col-sm-8'>
                            <input
                                type='text'
                                className='form-control'
                                id='SessionLengthWebInDays'
                                ref='SessionLengthWebInDays'
                                placeholder='Ex "30"'
                                defaultValue={this.props.config.ServiceSettings.SessionLengthWebInDays}
                                onChange={this.handleChange}
                            />
                            <p className='help-text'>{'The web session will expire after the number of days specified and will require a user to login again.'}</p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='SessionLengthMobileInDays'
                        >
                            {'Session Length for Mobile Device in Days:'}
                        </label>
                        <div className='col-sm-8'>
                            <input
                                type='text'
                                className='form-control'
                                id='SessionLengthMobileInDays'
                                ref='SessionLengthMobileInDays'
                                placeholder='Ex "30"'
                                defaultValue={this.props.config.ServiceSettings.SessionLengthMobileInDays}
                                onChange={this.handleChange}
                            />
                            <p className='help-text'>{'The native mobile session will expire after the number of days specified and will require a user to login again.'}</p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='SessionLengthSSOInDays'
                        >
                            {'Session Length for SSO in Days:'}
                        </label>
                        <div className='col-sm-8'>
                            <input
                                type='text'
                                className='form-control'
                                id='SessionLengthSSOInDays'
                                ref='SessionLengthSSOInDays'
                                placeholder='Ex "30"'
                                defaultValue={this.props.config.ServiceSettings.SessionLengthSSOInDays}
                                onChange={this.handleChange}
                            />
                            <p className='help-text'>{'The SSO session will expire after the number of days specified and will require a user to login again.'}</p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label
                            className='control-label col-sm-4'
                            htmlFor='SessionCacheInMinutes'
                        >
                            {'Session Cache in Minutes:'}
                        </label>
                        <div className='col-sm-8'>
                            <input
                                type='text'
                                className='form-control'
                                id='SessionCacheInMinutes'
                                ref='SessionCacheInMinutes'
                                placeholder='Ex "30"'
                                defaultValue={this.props.config.ServiceSettings.SessionCacheInMinutes}
                                onChange={this.handleChange}
                            />
                            <p className='help-text'>{'The number of minutes to cache a session in memory.'}</p>
                        </div>
                    </div>

                    <div className='form-group'>
                        <div className='col-sm-12'>
                            {serverError}
                            <button
                                disabled={!this.state.saveNeeded}
                                type='submit'
                                className={saveClass}
                                onClick={this.handleSubmit}
                                id='save-button'
                                data-loading-text={'<span class=\'glyphicon glyphicon-refresh glyphicon-refresh-animate\'></span> Saving Config...'}
                            >
                                {'Save'}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        );
    }
}

// <div className='form-group'>
//     <label
//         className='control-label col-sm-4'
//         htmlFor='EnableOAuthServiceProvider'
//     >
//         {'Enable OAuth Service Provider: '}
//     </label>
//     <div className='col-sm-8'>
//         <label className='radio-inline'>
//             <input
//                 type='radio'
//                 name='EnableOAuthServiceProvider'
//                 value='true'
//                 ref='EnableOAuthServiceProvider'
//                 defaultChecked={this.props.config.ServiceSettings.EnableOAuthServiceProvider}
//                 onChange={this.handleChange}
//             />
//                 {'true'}
//         </label>
//         <label className='radio-inline'>
//             <input
//                 type='radio'
//                 name='EnableOAuthServiceProvider'
//                 value='false'
//                 defaultChecked={!this.props.config.ServiceSettings.EnableOAuthServiceProvider}
//                 onChange={this.handleChange}
//             />
//                 {'false'}
//         </label>
//         <p className='help-text'>{'When enabled Mattermost will act as an OAuth2 Provider.  Changing this will require a server restart before taking effect.'}</p>
//     </div>
// </div>

ServiceSettings.propTypes = {
    config: React.PropTypes.object
};
