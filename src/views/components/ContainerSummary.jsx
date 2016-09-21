var React = require('react');
var ContainerStatusBadge = require('./ContainerStatusBadge');

class ContainerSummary extends React.Component {
    render() {
        return (
            <div>
                <article className="card">
                    <header className="flex">
                        <strong><span>{this.props.summary.name}</span> <ContainerStatusBadge status={this.props.summary.status}/></strong>
                    </header>
                    <footer>
                        <div className="stack">
                            Image: {this.props.summary.imageName}
                        </div>
                    </footer>
                </article>
            </div>
        );
    }
}

module.exports = ContainerSummary;
