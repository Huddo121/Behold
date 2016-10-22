var React = require('react');
var ContainerStatusBadge = require('./ContainerStatusBadge');

class ContainerSummary extends React.Component {
    render() {
        return (
            <div style={{width: 'fit-content'}}>
                <article className="card">
                    <header>
                        <strong><span><a href={"/containers/" + this.props.summary.id}>{this.props.summary.name}</a></span> <ContainerStatusBadge status={this.props.summary.status}/></strong>
                    </header>
                    <footer>
                        <div className="stack">
                            Image: <a href={"/images/" + this.props.summary.imageId}>{this.props.summary.imageName}</a>
                        </div>
                    </footer>
                </article>
            </div>
        );
    }
}

module.exports = ContainerSummary;
