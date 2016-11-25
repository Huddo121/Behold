var React = require('react');
var DefaultLayout = require('./layout.jsx');
var ansiUp = require('ansi_up');

class ContainerDetailsPage extends React.Component {
    render() {
        let details = this.props.containerDetails;

        //Set up the header items
        let headerItems = [];
        headerItems.push(<h1 key="name">{details.name}</h1>);

        if(details.author) {
            headerItems.push(
                <small key="imageName">
                    {details.imageName}
                </small>
            );
        }

        //Some items should only appear if they are populated
        let optionalItems = [];

        if(details.ports.length > 0) {
            let portCells = details.ports.map(port=> {
                return (
                    <tr key={port.containerPort}>
                        <td style={{align: 'right'}}>{port.hostPorts.join(", ")}</td>
                        <td>{port.containerPort}</td>
                    </tr>);
            });

            optionalItems.push(
                <div className="col-xs-6" key="ports">
                    <h4>Ports</h4>
                    <table className="table">
                        <tbody>
                            <tr>
                                <th>Host Ports</th>
                                <th>Container Port</th>
                            </tr>
                        {portCells}
                        </tbody>
                    </table>
                </div>
            )
        }

        if(details.volumes.length > 0) {
            let volumes = details.volumes.map(volume => {
                return (<li key={volume}>
                    {volume.source} -> {volume.destination}
                </li>);
            });

            let volumeCells = details.volumes.map(volume => {
                return (
                    <tr key={volume.destination}>
                        <td>{volume.source}</td>
                        <td>{volume.destination}</td>
                    </tr>);
            });

            optionalItems.push(
                <div className="col-xs-12" key="volumes">
                    <h4>Volumes</h4>
                    <table className="table">
                        <tbody>
                            <tr>
                                <th>Local Path</th>
                                <th>Container Path</th>
                            </tr>
                            {volumeCells}
                        </tbody>
                    </table>
                </div>
            )
        }

        return (
            <DefaultLayout title='Images'>
                <link rel="stylesheet" href="/stylesheets/monokai_sublime.css"/>
                <div className="container-fluid">
                    <div className="card card-block">
                        <header>
                            {headerItems}
                        </header>
                        <hr/>
                        <footer>
                            <p>
                                Creation Date: {details.creationDate}
                            </p>
                            {optionalItems}
                        </footer>
                        <div className="col-xs-12">
                            <h4>Container Log</h4>
                            <pre className="highlight">
                                {/* TODO: Find a better way to do this */}
                                <code className="hljs">
                                    <span dangerouslySetInnerHTML={{ __html: ansiUp.ansi_to_html(this.props.logs) }}>
                                    </span>
                                </code >
                            </pre>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        );
    }
}

module.exports = ContainerDetailsPage;
