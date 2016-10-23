var React = require('react');
var DefaultLayout = require('./layout.jsx');


class ImageDetailsPage extends React.Component {
    render() {
        let details = this.props.imageDetails;

        //Set up the header items
        let headerItems = [];
        headerItems.push(<h3 key="name">{details.name}</h3>);

        if(details.author) {
            headerItems.push(
                <small key="author">
                    {this.props.imageDetails.author}
                </small>
            );
        }

        //Some items should only appear if they are populated
        let optionalItems = [];
        if(details.description) {
            optionalItems.push(
                <p key="description">
                    Description: {details.description}
                </p>
            );
        }

        if(details.ports.length > 0) {
            let ports = details.ports.map(port => {
                return (<li key={port}>
                    {port}
                </li>);
            });

            optionalItems.push(
                <div key="ports">
                    Exposed Ports:
                    <ul>
                        {ports}
                    </ul>
                </div>
            )
        }

        if(details.volumes.length > 0) {
            let volumes = details.volumes.map(volume => {
                return (<li key={volume}>
                    {volume}
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
                    </div>
                </div>
            </DefaultLayout>
        );
    }
}

module.exports = ImageDetailsPage;
