var React = require('react');
var ContainerStatusBadge = require('./ContainerStatusBadge');

class ContainerSummary extends React.Component {
    render() {
        return (
            <div className="card summary">
                <div className="card-block">
                    <strong className="card-title">
                        <a href={"/containers/" + this.props.summary.id}>{this.props.summary.name}</a>
                        <ContainerStatusBadge status={this.props.summary.status}/>
                    </strong>
                    <hr/>
                    <p className="card-text">
                        Image: <a href={"/images/" + this.props.summary.imageId}>{this.props.summary.imageName}</a>
                    </p>
                </div>
            </div>
        );
    }
}

module.exports = ContainerSummary;
