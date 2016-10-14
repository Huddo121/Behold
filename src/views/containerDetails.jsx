var React = require('react');
var DefaultLayout = require('./layout.jsx');

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
                <div>
                    <div className="card">
                        <header>
                            {headerItems}
                        </header>
                        <footer>
                            <p>
                                Creation Date: {details.creationDate}
                            </p>
                            {optionalItems}
                        </footer>
                    </div>
                </div>
            </DefaultLayout>
        );
    }
}

module.exports = ContainerDetailsPage;
