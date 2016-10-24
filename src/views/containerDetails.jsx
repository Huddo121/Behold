var React = require('react');
var DefaultLayout = require('./layout.jsx');
var ansiUp = require('ansi_up');

class ContainerDetailsPage extends React.Component {
    render() {
        let details = this.props.containerDetails;

        //Set up the header items
        let headerItems = [];
        headerItems.push(<h3 key="name">{details.name}</h3>);

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
            let ports = details.ports.map(port => {
                return (<li key={port}>
                    {port}
                </li>);
            });

            optionalItems.push(
                <div key="ports">
                    Image's Exposed Ports:
                    <ul>
                        {ports}
                    </ul>
                </div>
            )
        }

        if(details.volumes.length > 0) {
            let volumes = details.volumes.map(volume => {
                return (<li key={volume}>
                    {volume.source} -> {volume.destination}
                </li>);
            });

            optionalItems.push(
                <div key="volumes">
                    Volumes:
                    <ul>
                        {volumes}
                    </ul>
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
                        <pre className="highlight">
                            {/* TODO: Find a better way to do this */}
                            <code className="hljs">
                                <span dangerouslySetInnerHTML={{ __html: ansiUp.ansi_to_html(this.props.logs) }}>
                                </span>
                            </code >
                        </pre>
                    </div>
                </div>
            </DefaultLayout>
        );
    }
}

module.exports = ContainerDetailsPage;
