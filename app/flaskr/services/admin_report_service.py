from flaskr.models import AdminReport
from flaskr.db import db

class AdminReportService:
    @staticmethod
    def create_report(report_name, generated_by, report_data):
        """Create a new admin report"""
        report = AdminReport(
            report_name=report_name,
            generated_by=generated_by,
            report_data=report_data
        )
        db.session.add(report)
        db.session.commit()
        return report

    @staticmethod
    def get_report_by_id(report_id):
        """Get report by ID"""
        return AdminReport.query.get(report_id)

    @staticmethod
    def get_all_reports():
        """Get all reports"""
        return AdminReport.query.all() 