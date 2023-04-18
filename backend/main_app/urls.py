from django.urls import path

from . import views

urlpatterns = [
    path('init', views.init_icons),

    path('check_user_exist', views.check_user_exist),

    path('get_books', views.get_books),
    path('get_book_by_id', views.get_book_by_id),
    path('get_records_by_book', views.get_records_by_book),
    path('get_records_by_month', views.get_records_by_month),
    path('get_recent_records_count', views.get_recent_records_count),
    path('get_record_by_id', views.get_record_by_id),
    path('get_categories', views.get_categories),
    path('get_all_categories', views.get_all_categories),
    path('get_notes', views.get_notes),

    path('add_book', views.add_book),
    path('add_record', views.add_record),
    path('add_note', views.add_note),

    path('edit_record', views.edit_record),
    path('update_book_title', views.update_book_title),
    path('update_book_partner', views.update_book_partner),

    path('delete_record_by_id', views.delete_record_by_id),
    path('delete_book_by_id', views.delete_book_by_id),
]
