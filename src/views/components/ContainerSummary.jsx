var React = require('react');

class ContainerSummary extends React.Component {
    render() {
        return (
            <div>
                <article className="card">
                    <header className="flex">
                        <strong><span>{this.props.summary.Name}</span> <span className="label">{this.props.summary.Status}</span></strong>
                    </header>
                    <footer>
                        <div className="stack">
                            Image: {this.props.summary.ImageName}
                        </div>
                    </footer>
                </article>
            </div>
        );
    }
}

module.exports = ContainerSummary;
