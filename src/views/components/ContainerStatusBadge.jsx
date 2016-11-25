var React = require('react');

class ContainerStatusBadge extends React.Component {
    render() {
        return (
            <span className="tag tag-primary pull-xs-right container-status">{this.props.status}</span>
        );
    }
}

module.exports = ContainerStatusBadge;
