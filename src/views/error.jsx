var React = require('react');
var DefaultLayout = require('./layout');

class ErrorPage extends React.Component {
    render() {
        return (
            <DefaultLayout>
                <h1>{this.props.message}</h1>
                <h2>{this.props.error.status}</h2>
                <pre>{this.props.error.stack}</pre>
            </DefaultLayout>
        );
    }
}

module.exports = ErrorPage;
