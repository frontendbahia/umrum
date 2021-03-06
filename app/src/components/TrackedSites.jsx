import React from "react";
import { postData } from "../common/request";
import AddSiteForm from "./AddSiteForm";
import SiteItem from "./SiteItem";


export default class TrackedSites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sites: this.props.sites
    };
  }

  addHost(data) {
    this.setState({
      sites: this.state.sites.concat(data.site)
    });
  }

  trackNewSite(host) {
    postData('/api/dashboard/create', {host: host}).then(data => this.addHost(data));
  }

  render() {
    let siteItems = this.state.sites.map(function(site) {
      return (<SiteItem key={site.code} site={site} />);
    });

    return (
      <div id="sites_manager" className="row">
        <div className="col-lg-6">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h3 className="panel-title"><i className="fa fa-file-text-o"></i> Your sites</h3>
            </div>
            <div className="panel-body">
              {siteItems}
            </div>
            <AddSiteForm onSiteSubmit={this.trackNewSite.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}
