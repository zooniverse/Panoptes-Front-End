import React from 'react';
import PropTypes from 'prop-types';
import apiClient from 'panoptes-client/lib/api-client';
import moment from 'moment';
import Translate from 'react-translate-component';

export default class DataExportDownloadLink extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            requested: false,
            mostRecent: null,
            error: null
        }

        this.getExport = this.getExport.bind(this);
        this.recentAndReady = this.recentAndReady.bind(this);
        this.pending = this.pending.bind(this);
    }

    recentAndReady(exported) {
        return exported && (exported.metadata.state === 'ready' || !exported.metadata.state);
    }

    pending(exported) {
        return !!exported;
    }

    componentDidMount() {
        this.getExport();
    }

    getExport() {
        return this.props.project.get(this.props.exportType).then((response) => {
            if (response.errors) {
                this.setState({requested: true, error: response.errors});
            } else {
                this.setState({ requested: true, mostRecent: response[0] });
            }
        }).catch((error) => {
            if (error.status != 404) {
                this.setState({requested: true, error: error});
            } else {
                this.setState({requested: true});
            }
        })
    }

    render() {
        if (!this.state.requested) {
            return (<span>Loading status of export</span>);
        } else if (this.state.error) {
            return (<span>Error loading export information</span>);
        } else if (this.recentAndReady(this.state.mostRecent)) {
            return (<span>
                {`Most recent data available requested ${moment(this.state.mostRecent.updated_at).fromNow()}, `}
                <a href={this.state.mostRecent.src}>download your data export</a>.
              </span >);
        } else if (this.pending(this.state.mostRecent)) {
            return (<span>Export is being generated.</span>);
        } else {
            return (<span>Never previously requested.</span>);
        }
    }
}

DataExportDownloadLink.propTypes = {
    project: PropTypes.object,
    exportType: PropTypes.string
}

DataExportDownloadLink.defaultProps = {
    contentType: 'text/csv'
}
