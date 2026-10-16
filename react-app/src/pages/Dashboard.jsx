import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load stored user & token
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse user session', e);
            }
        }

        // Fetch live insights from Laravel API
        const fetchInsights = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8080/api/dashboard/insights', {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setInsights(data);
                }
            } catch (err) {
                console.warn('Could not fetch backend insights, using defaults:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const displayName = user?.name || 'Administrator';
    const workspaceName = user?.tenant?.name || `${displayName}'s Workspace`;
    const planName = user?.tenant?.plan ? user.tenant.plan.toUpperCase() : 'ENTERPRISE PRO';

    // Metrics calculation with fallbacks
    const networkReach = insights?.networkReach || '14,820';
    const transmissionVolume = insights?.transmissionVolume || '48,930';
    const deliveryRate = insights?.deliveryEfficiency ? `${insights.deliveryEfficiency}%` : '98.8%';
    const readRate = insights?.interactionConversion ? `${insights.interactionConversion}%` : '84.2%';

    const campaigns = [
        {
            id: 'CMP-104',
            name: 'Holiday Flash Sale Broadcast',
            audience: 'VIP Customers (5,400)',
            delivered: '99.2%',
            read: '88.4%',
            status: 'Delivering',
            statusColor: '#22C55E',
            date: 'Today, 11:30 AM'
        },
        {
            id: 'CMP-103',
            name: 'Cart Recovery AI Follow-Up',
            audience: 'Abandoned Carts (1,240)',
            delivered: '98.5%',
            read: '91.0%',
            status: 'Active Automated',
            statusColor: '#0EA5E9',
            date: 'Continuous'
        },
        {
            id: 'CMP-102',
            name: 'Customer Satisfaction NPS Survey',
            audience: 'Recent Buyers (3,100)',
            delivered: '97.9%',
            read: '76.5%',
            status: 'Completed',
            statusColor: '#64748B',
            date: 'Yesterday'
        },
        {
            id: 'CMP-101',
            name: 'Product Update & Feature Announcement',
            audience: 'All Subscribers (12,850)',
            delivered: '99.4%',
            read: '82.7%',
            status: 'Completed',
            statusColor: '#64748B',
            date: 'Oct 12, 2026'
        }
    ];

    const quickLinks = [
        { title: 'WhatsApp Campaigns', path: '/whatsapp-campaigns', icon: 'fa-bullhorn', desc: 'Broadcast personalized messages to segmented audiences.' },
        { title: 'Automated Messaging', path: '/automated-messaging', icon: 'fa-robot', desc: 'Configure trigger-based drip sequences and auto-replies.' },
        { title: 'AI WhatsApp Copilot', path: '/whatsapp-ai-copilot', icon: 'fa-sparkles', desc: 'Manage your autonomous GPT agent responses.' },
        { title: 'Contact List Retargeting', path: '/contact-list-retargeting', icon: 'fa-users', desc: 'Import, filter and sync tagged customer audiences.' },
        { title: 'WhatsApp Analytics', path: '/whatsapp-analytics', icon: 'fa-chart-line', desc: 'Track live delivery, reads, and conversion metrics.' }
    ];

    return (
        <Layout>
            <style>{`
                .dash-metric-card {
                    background: #ffffff;
                    border: 1px solid #E2E8F0;
                    border-radius: 20px;
                    padding: 28px;
                    transition: transform 0.3s ease, border-color 0.3s ease;
                }
                .dash-metric-card:hover {
                    transform: translateY(-4px);
                    border-color: #22C55E;
                }
                .dash-action-btn {
                    background: #22C55E;
                    color: #ffffff;
                    border-radius: 50px;
                    padding: 12px 28px;
                    font-weight: 700;
                    font-size: 14px;
                    border: none;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                }
                .dash-action-btn:hover {
                    transform: translateY(-3px);
                    color: #ffffff;
                    box-shadow: none;
                }
                .dash-outline-btn {
                    background: #ffffff;
                    color: #12263A;
                    border: 1px solid #E2E8F0;
                    border-radius: 50px;
                    padding: 10px 24px;
                    font-weight: 700;
                    font-size: 13px;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .dash-outline-btn:hover {
                    background: #12263A;
                    color: #ffffff;
                    border-color: #12263A;
                }
                .dash-panel {
                    background: #ffffff;
                    border: 1px solid #E2E8F0;
                    border-radius: 20px;
                    padding: 32px;
                }
                .quick-link-item {
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 16px;
                    padding: 18px 20px;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    transition: all 0.3s ease;
                }
                .quick-link-item:hover {
                    background: #F0FDF4;
                    border-color: #22C55E;
                    transform: translateX(4px);
                }
            `}</style>

            <section style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '120px 0 80px 0' }}>
                <div className="container">
                    
                    {/* Welcome Banner */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-5 p-4 rounded-4" style={{ background: '#ffffff', border: '1px solid #E2E8F0' }}>
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '22px', fontWeight: '800' }}>
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="d-flex align-items-center gap-2">
                                    <h2 style={{ color: '#12263A', fontWeight: '800', fontSize: '1.65rem', margin: 0, letterSpacing: '-0.5px' }}>
                                        Welcome, {displayName}
                                    </h2>
                                    <span style={{ background: '#F0FDF4', color: '#22C55E', border: '1px solid #DCFCE7', borderRadius: '30px', padding: '2px 10px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>
                                        {planName}
                                    </span>
                                </div>
                                <p style={{ color: '#57534E', margin: '4px 0 0 0', fontSize: '14px' }}>
                                    <i className="fas fa-building me-1 text-muted" /> {workspaceName} &bull; <span style={{ color: '#22C55E', fontWeight: '600' }}><i className="fas fa-circle me-1" style={{ fontSize: '8px' }} /> Meta WhatsApp API Active</span>
                                </p>
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <a href="/whatsapp-campaigns" className="dash-action-btn">
                                <i className="fas fa-plus" /> New Campaign
                            </a>
                            <button onClick={handleLogout} className="dash-outline-btn">
                                <i className="fas fa-sign-out-alt" /> Log Out
                            </button>
                        </div>
                    </div>

                    {/* KPI Cards Row */}
                    <div className="row g-4 mb-5">
                        <div className="col-lg-3 col-sm-6">
                            <div className="dash-metric-card">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <span style={{ color: '#57534E', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Reach</span>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#F0FDF4', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                                        <i className="fas fa-users" />
                                    </div>
                                </div>
                                <h3 style={{ color: '#12263A', fontWeight: '800', fontSize: '2.1rem', margin: '0 0 6px 0', letterSpacing: '-1px' }}>
                                    {networkReach}
                                </h3>
                                <p style={{ color: '#22C55E', fontSize: '12px', fontWeight: '700', margin: 0 }}>
                                    <i className="fas fa-arrow-up me-1" /> +14.2% verified audience
                                </p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-sm-6">
                            <div className="dash-metric-card">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <span style={{ color: '#57534E', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Messages Sent</span>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                                        <i className="fas fa-paper-plane" />
                                    </div>
                                </div>
                                <h3 style={{ color: '#12263A', fontWeight: '800', fontSize: '2.1rem', margin: '0 0 6px 0', letterSpacing: '-1px' }}>
                                    {transmissionVolume}
                                </h3>
                                <p style={{ color: '#57534E', fontSize: '12px', fontWeight: '600', margin: 0 }}>
                                    Lifetime broadcast & drip messages
                                </p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-sm-6">
                            <div className="dash-metric-card">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <span style={{ color: '#57534E', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Delivery Rate</span>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#F0FDF4', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                                        <i className="fas fa-check-double" />
                                    </div>
                                </div>
                                <h3 style={{ color: '#12263A', fontWeight: '800', fontSize: '2.1rem', margin: '0 0 6px 0', letterSpacing: '-1px' }}>
                                    {deliveryRate}
                                </h3>
                                <p style={{ color: '#22C55E', fontSize: '12px', fontWeight: '700', margin: 0 }}>
                                    <i className="fas fa-shield-alt me-1" /> Official Meta Cloud Tier
                                </p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-sm-6">
                            <div className="dash-metric-card">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <span style={{ color: '#57534E', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Open / Read Rate</span>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#FAF5FF', color: '#A855F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                                        <i className="fas fa-eye" />
                                    </div>
                                </div>
                                <h3 style={{ color: '#12263A', fontWeight: '800', fontSize: '2.1rem', margin: '0 0 6px 0', letterSpacing: '-1px' }}>
                                    {readRate}
                                </h3>
                                <p style={{ color: '#A855F7', fontSize: '12px', fontWeight: '700', margin: 0 }}>
                                    Avg. response time: 42s
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Two-Column Layout */}
                    <div className="row g-4">
                        
                        {/* Left Column: Campaigns & Flows */}
                        <div className="col-lg-8">
                            
                            {/* Recent Campaigns Table */}
                            <div className="dash-panel mb-4">
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <div>
                                        <h3 style={{ color: '#12263A', fontWeight: '800', fontSize: '1.3rem', margin: 0, letterSpacing: '-0.5px' }}>
                                            Recent WhatsApp Campaigns
                                        </h3>
                                        <p style={{ color: '#57534E', fontSize: '13px', margin: '4px 0 0 0' }}>
                                            Direct broadcast delivery statistics & open rates
                                        </p>
                                    </div>
                                    <a href="/whatsapp-campaigns" style={{ color: '#22C55E', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>
                                        View All Campaigns &rarr;
                                    </a>
                                </div>

                                <div className="table-responsive">
                                    <table className="table align-middle" style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                                        <thead>
                                            <tr style={{ color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                <th style={{ border: 'none' }}>Campaign</th>
                                                <th style={{ border: 'none' }}>Target Audience</th>
                                                <th style={{ border: 'none' }}>Delivery</th>
                                                <th style={{ border: 'none' }}>Read Rate</th>
                                                <th style={{ border: 'none', textAlign: 'right' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {campaigns.map((camp) => (
                                                <tr key={camp.id} style={{ background: '#F8FAFC', borderRadius: '12px' }}>
                                                    <td style={{ padding: '16px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px', border: 'none' }}>
                                                        <div style={{ fontWeight: '700', color: '#12263A', fontSize: '14px' }}>{camp.name}</div>
                                                        <div style={{ color: '#94A3B8', fontSize: '11px', marginTop: '2px' }}>{camp.id} &bull; {camp.date}</div>
                                                    </td>
                                                    <td style={{ padding: '16px', border: 'none', color: '#57534E', fontSize: '13px', fontWeight: '600' }}>
                                                        {camp.audience}
                                                    </td>
                                                    <td style={{ padding: '16px', border: 'none', color: '#12263A', fontSize: '13px', fontWeight: '800' }}>
                                                        {camp.delivered}
                                                    </td>
                                                    <td style={{ padding: '16px', border: 'none', color: '#22C55E', fontSize: '13px', fontWeight: '800' }}>
                                                        {camp.read}
                                                    </td>
                                                    <td style={{ padding: '16px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px', border: 'none', textAlign: 'right' }}>
                                                        <span style={{ background: `${camp.statusColor}15`, color: camp.statusColor, border: `1px solid ${camp.statusColor}30`, borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: '800' }}>
                                                            {camp.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Active Automation Flows */}
                            <div className="dash-panel">
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <div>
                                        <h3 style={{ color: '#12263A', fontWeight: '800', fontSize: '1.3rem', margin: 0, letterSpacing: '-0.5px' }}>
                                            Active Automation Workflows
                                        </h3>
                                        <p style={{ color: '#57534E', fontSize: '13px', margin: '4px 0 0 0' }}>
                                            Real-time AI triggers, conversational routing, and CRM webhooks
                                        </p>
                                    </div>
                                    <a href="/automated-messaging" style={{ color: '#22C55E', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>
                                        Manage Workflows &rarr;
                                    </a>
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E' }} />
                                                    <span style={{ fontWeight: '700', color: '#12263A', fontSize: '14px' }}>Lead Qualification Copilot</span>
                                                </div>
                                                <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: '800' }}>ONLINE</span>
                                            </div>
                                            <p style={{ color: '#57534E', fontSize: '12px', margin: '0 0 12px 0' }}>
                                                Engages inbound prospects, captures emails, and logs qualifiers to CRM automatically.
                                            </p>
                                            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                                                Processed: 842 chats this week
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E' }} />
                                                    <span style={{ fontWeight: '700', color: '#12263A', fontSize: '14px' }}>Support Ticket Auto-Router</span>
                                                </div>
                                                <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: '800' }}>ONLINE</span>
                                            </div>
                                            <p style={{ color: '#57534E', fontSize: '12px', margin: '0 0 12px 0' }}>
                                                Detects customer urgency, matches keywords, and assigns human agents instantly.
                                            </p>
                                            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                                                Processed: 1,208 resolutions
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: API Health & Quick Links */}
                        <div className="col-lg-4">
                            
                            {/* Meta WhatsApp Integration Card */}
                            <div className="dash-panel mb-4" style={{ background: 'linear-gradient(135deg, #12263A 0%, #1E3A5F 100%)', color: '#ffffff', border: 'none' }}>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <span style={{ color: '#22C55E', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                        <i className="fab fa-whatsapp me-1" /> Cloud API Status
                                    </span>
                                    <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22C55E', border: '1px solid rgba(34, 197, 94, 0.4)', borderRadius: '20px', padding: '2px 10px', fontSize: '10px', fontWeight: '800' }}>
                                        VERIFIED
                                    </span>
                                </div>

                                <h4 style={{ color: '#ffffff', fontWeight: '800', fontSize: '1.25rem', marginBottom: '8px' }}>
                                    Meta WhatsApp Business
                                </h4>
                                <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '20px' }}>
                                    Official WhatsApp Cloud API connected via Throbtech enterprise infrastructure.
                                </p>

                                <div className="p-3 rounded-3 mb-3" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    <div className="d-flex justify-content-between mb-2" style={{ fontSize: '12px' }}>
                                        <span style={{ color: '#94A3B8' }}>Quality Rating:</span>
                                        <span style={{ color: '#22C55E', fontWeight: '700' }}>High Quality (Green)</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2" style={{ fontSize: '12px' }}>
                                        <span style={{ color: '#94A3B8' }}>Throughput Tier:</span>
                                        <span style={{ color: '#ffffff', fontWeight: '700' }}>100,000 msgs / day</span>
                                    </div>
                                    <div className="d-flex justify-content-between" style={{ fontSize: '12px' }}>
                                        <span style={{ color: '#94A3B8' }}>Approved Templates:</span>
                                        <span style={{ color: '#ffffff', fontWeight: '700' }}>24 Ready</span>
                                    </div>
                                </div>

                                <a href="/whatsapp-ai-copilot" className="dash-action-btn w-100 justify-content-center" style={{ padding: '12px 20px', fontSize: '13px' }}>
                                    <i className="fas fa-cog" /> Configure Copilot &amp; API
                                </a>
                            </div>

                            {/* Navigation Quick Links */}
                            <div className="dash-panel">
                                <h4 style={{ color: '#12263A', fontWeight: '800', fontSize: '1.15rem', marginBottom: '16px', letterSpacing: '-0.5px' }}>
                                    Quick Access Hub
                                </h4>
                                <div className="d-flex flex-column gap-2">
                                    {quickLinks.map((item, index) => (
                                        <a key={index} href={item.path} className="quick-link-item">
                                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F0FDF4', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                                                <i className={`fas ${item.icon}`} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: '700', color: '#12263A', fontSize: '13px' }}>{item.title}</div>
                                                <div style={{ color: '#64748B', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {item.desc}
                                                </div>
                                            </div>
                                            <i className="fas fa-chevron-right" style={{ color: '#CBD5E1', fontSize: '11px' }} />
                                        </a>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </section>
        </Layout>
    );
};

export default Dashboard;
