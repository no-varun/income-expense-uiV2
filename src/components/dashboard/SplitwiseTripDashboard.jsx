import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSplitwiseDashboard } from "../../api/splitwiseApi";

const money = (amount, currency = "INR") => new Intl.NumberFormat("en-IN", {
    style: "currency", currency, maximumFractionDigits: 2
}).format(Number(amount || 0));

const SplitwiseTripDashboard = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSplitwiseDashboard()
            .then((response) => setTrips(response?.success && Array.isArray(response.data?.trips) ? response.data.trips : []))
            .catch(() => setTrips([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-muted small py-2">Loading trip settlements...</div>;
    if (!trips.length) return <div className="text-muted">No shared trips created yet.</div>;

    return <div className="row g-3">
        {trips.map((trip) => <div className="col-12" key={trip._id}>
            <div className="border rounded p-3 bg-light">
                <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
                    <div><div className="fw-semibold">{trip.name}</div><div className="small text-muted">Fund: {money(trip.totalFund, trip.currency)} · Expense: {money(trip.totalExpense, trip.currency)}</div></div>
                    <Link className="btn btn-sm btn-outline-primary" to={`/splitwise/groups/${trip._id}`}>Open Trip</Link>
                </div>
                <div className="row g-3">
                    <div className="col-md-6"><div className="small fw-semibold text-success mb-1">Lent / gets back</div>{trip.lenders.length ? trip.lenders.map((member) => <div className="d-flex justify-content-between small" key={member._id}><span>{member.name}</span><strong className="text-success">{money(member.amount, trip.currency)}</strong></div>) : <div className="small text-muted">No member is owed money.</div>}</div>
                    <div className="col-md-6"><div className="small fw-semibold text-danger mb-1">Borrowed / owes</div>{trip.borrowers.length ? trip.borrowers.map((member) => <div className="d-flex justify-content-between small" key={member._id}><span>{member.name}</span><strong className="text-danger">{money(member.amount, trip.currency)}</strong></div>) : <div className="small text-muted">No member has an amount due.</div>}</div>
                </div>
                {trip.suggestions.length > 0 && <div className="border-top mt-3 pt-2 small">{trip.suggestions.map((item, index) => <div className="d-flex justify-content-between" key={`${item.fromMember._id}-${item.toMember._id}-${index}`}><span>{item.fromMember.name} pays {item.toMember.name}</span><strong>{money(item.amount, trip.currency)}</strong></div>)}</div>}
            </div>
        </div>)}
    </div>;
};

export default SplitwiseTripDashboard;
