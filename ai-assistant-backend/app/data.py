from atlassian import Confluence
from bs4 import BeautifulSoup
import json
import os
from dotenv import load_dotenv

class data: 

    # Función para obtener datos de las páginas en cada Space y guardarlos en un archivo JSON
    def get_pages_data_and_save_to_file():
        
        # URL de la instancia de Confluence
        # Token de acceso
        load_dotenv()
        confluence_access_token = os.getenv("CONFLUENCE_ACCESS_TOKEN")
        confluence_url = os.getenv("CONFLUENCE_URL")

        if not os.path.exists('./registros'):
            print('Se ha creado el directorio ./registros')
            os.makedirs('./registros')

        # Crear conexión con Confluence
        confluence = Confluence(
            url=confluence_url,
            token=confluence_access_token
        )
        
        # Lista para almacenar los datos de las páginas
        all_pages_data = []

        # Obtener todos los Spaces
        spaces = confluence.get_all_spaces(start=0, limit=100, expand='description.plain')

        # Iterar sobre cada Space y obtener sus páginas
        for space in spaces['results']:
            space_key = space['key']
            space_name = space['name']
            print(f"Obteniendo datos del Space: {space_name} (Key: {space_key})")

            # Obtener todas las páginas en el Space
            pages = confluence.get_all_pages_from_space(space_key, start=0, limit=100)

            # Iterar sobre cada página y obtener sus detalles
            for page in pages:
                page_id = page['id']
                page_title = page['title']
                page_url = f"{confluence_url}/spaces/{space_key}/pages/{page_id}/{page_title.replace(' ', '-')}"

                # Obtener contenido de la página
                page_content = confluence.get_page_by_id(page_id, expand='body.storage')
                if 'body' in page_content and 'storage' in page_content['body']:
                    page_html_content = page_content['body']['storage']['value']

                    # Utilizar BeautifulSoup para extraer el texto plano
                    soup = BeautifulSoup(page_html_content, 'html.parser')
                    page_text = soup.get_text(separator='\n').strip()  # Extraer el texto y eliminar espacios en blanco

                    # Añadir los datos de la página a la lista
                    if len(page_text) > 0:
                        page_data = {
                            'url': page_url,
                            'id': page_id,
                            'content': page_text  # Guardar solo el texto plano
                        }
                        all_pages_data.append(page_data)

        # Guardar los datos en un archivo JSON
        with open('./app/registros/confluence_pages_data.json', 'w', encoding='utf-8') as json_file:
            json.dump(all_pages_data, json_file, ensure_ascii=False, indent=4)

        print("Datos guardados en el archivo 'confluence_pages_data.json'.")

    # Llamar a la función para obtener datos y guardarlos en el archivo
    #get_pages_data_and_save_to_file()

    # from pymongo import MongoClient
    # import json
    # from bson import ObjectId, Timestamp 
    # from datetime import datetime

    # def default_serializer(obj):
    #     if isinstance(obj, datetime):
    #         return obj.isoformat()
    #     elif isinstance(obj, ObjectId):
    #         return str(obj)
    #     else:
    #         raise TypeError(f"Object of type {type(obj)} is not JSON serializable")

    # def delete_fields(d, fields): 
    #     if isinstance(d, dict):
    #         for field in fields:
    #             if field in d:
    #                 del d[field]
    #         for key in d:
    #             delete_fields(d[key], fields)
    #     elif isinstance(d, list):
    #         for item in d:
    #             delete_fields(item, fields)

    # def write_data():
    #     try:
    #         # Connect to MongoDB
    #         client = MongoClient("mongodb://localhost:27017/incidenceMongo")

    #         # Get the incidence collection
    #         incidencias = client.incidenceMongo.incidences

    #         # Fetch data from the collection
    #         data = incidencias.find()

    #         fields_to_delete = ["email", "status", "__v", "_id", "createdAt", "updatedAt"] 
    #         data_json = []

    #         for document in data:
    #             delete_fields(document, fields_to_delete)
    #             data_json.append(document)
                
    #         datos = json.dumps(data_json, indent=4, sort_keys=True, default=default_serializer)

    #         #print(data_json)

    #         with open('./registros/data.json', 'w') as outfile:
    #            outfile.write(datos)

    #     except Exception as e:
    #         print(f"Error connecting to MongoDB: {e}")

    #     finally:
    #         # Close the connection (optional, client might be garbage collected)
    #         if client:
    #             client.close()
