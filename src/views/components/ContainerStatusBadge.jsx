var React = require('react');

class ContainerStatusBadge extends React.Component {
    render() {
        return (
            <span className="label">{this.props.status}</span>
        );
    }
}

module.exports = ContainerStatusBadge;
