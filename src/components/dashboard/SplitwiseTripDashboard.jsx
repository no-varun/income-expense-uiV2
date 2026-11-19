import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import { getSplitwiseDashboard } from "../../api/splitwiseApi";

const money = (amount, currency = "INR") => new Intl.NumberFormat("en-IN", {
    style: "currency", currency, maximumFractionDigits: 2
}).format(Number(amount || 0));

const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatDateRange = (start, end) => {
    if (!start && !end) return null;
    const startStr = formatDate(start);
    const endStr = formatDate(end);
    if (startStr && endStr) return startStr === endStr ? startStr : `${startStr} – ${endStr}`;
    return startStr || endStr;
};

const SplitwiseTripDashboard = () => {
    const [trips, setTrips] = useState([]);
    const [latestTrip, setLatestTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSplitwiseDashboard()
            .then((response) => {
                if (response?.success) {
                    const allTrips = Array.isArray(response.data?.trips) ? response.data.trips : [];
                    setTrips(allTrips);
                    setLatestTrip(response.data?.latestTrip || allTrips[0] || null);
                } else {
                    setTrips([]);
                    setLatestTrip(null);
                }
            })
            .catch(() => {
                setTrips([]);
                setLatestTrip(null);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-muted small py-2">Loading latest trip settlements...</div>;
    if (!latestTrip) return <div className="text-muted">No shared trips created yet. <Link to="/splitwise" className="ms-1">Create a group</Link></div>;

    const trip = latestTrip;
    const dateRange = formatDateRange(trip.startDate, trip.endDate);

    return (
        <div className="border rounded-3 p-3 bg-light">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                <div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary">Latest Trip</span>
                        <h5 className="mb-0 fw-bold">{trip.name}</h5>
                    </div>
                    {dateRange && (
                        <div className="small text-muted mt-1 d-flex align-items-center gap-1">
                            <FaCalendarAlt className="text-secondary" />
                            <span>{dateRange}</span>
                        </div>
                    )}
                    {trip.description && (
                        <div className="small text-muted mt-1">{trip.description}</div>
                    )}
                </div>
                <Link className="btn btn-sm btn-primary" to={`/splitwise/groups/${trip._id}`}>
                    Open Trip <FaExternalLinkAlt className="ms-1 small" />
                </Link>
            </div>

            <div className="row g-2 mb-3">
                <div className="col-6 col-sm-4 col-md-3">
                    <div className="bg-white border rounded p-2">
                        <div className="small text-muted">Total Fund</div>
                        <div className="fw-semibold text-success">{money(trip.totalFund, trip.currency)}</div>
                    </div>
                </div>
                <div className="col-6 col-sm-4 col-md-3">
                    <div className="bg-white border rounded p-2">
                        <div className="small text-muted">Total Expense</div>
                        <div className="fw-semibold">{money(trip.totalExpense, trip.currency)}</div>
                    </div>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-md-6">
                    <div className="bg-white border rounded p-3 h-100">
                        <div className="small fw-semibold text-success mb-2">Lent / gets back</div>
                        {trip.lenders?.length ? (
                            trip.lenders.map((member) => (
                                <div className="d-flex justify-content-between small py-1 border-bottom" key={member._id}>
                                    <span>{member.name}</span>
                                    <strong className="text-success">{money(member.amount, trip.currency)}</strong>
                                </div>
                            ))
                        ) : (
                            <div className="small text-muted">No member is owed money.</div>
                        )}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="bg-white border rounded p-3 h-100">
                        <div className="small fw-semibold text-danger mb-2">Borrowed / owes</div>
                        {trip.borrowers?.length ? (
                            trip.borrowers.map((member) => (
                                <div className="d-flex justify-content-between small py-1 border-bottom" key={member._id}>
                                    <span>{member.name}</span>
                                    <strong className="text-danger">{money(member.amount, trip.currency)}</strong>
                                </div>
                            ))
                        ) : (
                            <div className="small text-muted">No member has an amount due.</div>
                        )}
                    </div>
                </div>
            </div>

            {trip.suggestions?.length > 0 && (
                <div className="bg-white border rounded p-3 mt-3">
                    <div className="small fw-semibold text-muted mb-2">Suggested Settlements</div>
                    {trip.suggestions.map((item, index) => (
                        <div className="d-flex justify-content-between small py-1" key={`${item.fromMember?._id || index}-${item.toMember?._id || index}`}>
                            <span><strong>{item.fromMember?.name}</strong> pays <strong>{item.toMember?.name}</strong></span>
                            <strong className="text-primary">{money(item.amount, trip.currency)}</strong>
                        </div>
                    ))}
                </div>
            )}

            {trips.length > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top small text-muted">
                    <span>Showing latest of {trips.length} shared trips</span>
                    <Link to="/splitwise" className="text-decoration-none fw-semibold">
                        View all trips &rarr;
                    </Link>
                </div>
            )}
        </div>
    );
};

export default SplitwiseTripDashboard;
