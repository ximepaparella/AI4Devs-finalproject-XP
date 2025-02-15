## Índice

0. [Ficha del proyecto](#0-ficha-del-proyecto)
1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)

---

## 0. Ficha del proyecto

### **0.1. Tu nombre completo:** 
Ximena Paparella

### **0.2. Nombre del proyecto:** 
Gifty

### **0.3. Descripción breve del proyecto:** 
The Gift Vouchers Platform is designed to enable businesses to create, sell, and manage customizable gift certificates. The platform will cater to small businesses, service providers, and enterprises, providing tools for personalization, sales tracking, and voucher validation through QR codes and unique alphanumeric codes. It will support white-label capabilities and integration with various platforms like WordPress and custom websites. The MVP will focus on the Argentine market, with plans to expand internationally.

### **0.4. URL del proyecto:** 

> Puede ser pública o privada, en cuyo caso deberás compartir los accesos de manera segura. Puedes enviarlos a [alvaro@lidr.co](mailto:alvaro@lidr.co) usando algún servicio como [onetimesecret](https://onetimesecret.com/).

### 0.5. URL o archivo comprimido del repositorio

https://github.com/ximepaparella/AI4Devs-finalproject-XP


---

## 1. Descripción general del producto


### **1.1. Objetivo:** 

- Provide an easy-to-use platform for small businesses and entrepreneurs to create and manage gift certificates.
- Enable customers to purchase and redeem vouchers with secure validation methods.
- Offer white-label solutions for businesses to customize the platform to their brand.
- Integrate seamlessly with popular CMS platforms and payment gateways.
- Deliver a scalable solution with robust analytics and multilingual capabilities.

### **1.2. Características y funcionalidades principales:**

### Voucher Creation and Customization

- Customizable sender and recipient details.
- Add personal messages.
- Choose from a variety of voucher templates.
- Set expiration dates and usage restrictions.
- Attach vouchers to specific services or products.
- Enable store managers to create and resend vouchers without requiring payment.

### Payment Integration

- Support for Mercado Pago in the MVP.
- Scalability to add PayPal and Stripe for international payments.

### Validation and Redemption

- QR code generation for easy scanning.
- Unique alphanumeric codes for manual validation.
- Redemption tracking for businesses.

### White-Label Features

- Custom branding (logos, colors, domain).
- API access for integration with client platforms.

### Analytics and Reporting

#### Key metrics for businesses:
- Sales trends.
- Top-selling products/services.
- Unused vouchers.
- Monthly sales reports.

#### Platform-wide metrics for administrators.

### Customer Experience

- Automated email notifications for:
  - Purchase confirmation.
  - Voucher delivery.
  - Expiration reminders.
- User-friendly interface for customization.
- Customer login to view vouchers, expiration dates, and transaction history.

## Integration Capabilities

- Ready-to-use plugin for WordPress.
- APIs for custom websites.
- Future support for widgets.

### Multi-Purchase Capability

- Allow customers to buy multiple vouchers in a single transaction.
- Generate separate vouchers for each product or service purchased.


## Diagramas

### Main Flow

This diagram gives a global view of how all users interact within the system. 
Reference flows/main-flows.png

`graph TD;
  A[Customer Browses Vouchers] -->|Selects & Customizes| B[Voucher Purchase]
  B -->|Payment Processed| C[Generate Voucher]
  C -->|Send via Email| D[Customer Receives Voucher]
  D -->|Views in My Account| E[Customer Dashboard]
  D -->|Presents QR Code| F[Voucher Redemption]
  F -->|Scans QR/Code Validation| G[Store Manager Confirms]
  G -->|Voucher Marked as Redeemed| H[Transaction Completed]
 subgraph Store Manager
    I[Create & Manage Vouchers] -->|Generate New Vouchers| C
    I -->|Modify & Resend| J[Voucher Resend]
    G -->|View Sales & Analytics| K[Sales Dashboard]
  end
 subgraph Administrator
    L[Manage Businesses & Users] -->|Oversee Activities| M[Platform Analytics]
    M -->|Monitor Sales & Reports| K
  end
`

###  Voucher Creation Flow
The adminsitrator or store creates the services and the expirations or restriction to allow users to buy that voucher to gift.

Reference: flows/voucher-creation.png

`graph TD;
  A[Store Manager Logs In] --> B[Navigates to Dashboard]
  B --> C[Clicks 'Create New Voucher']
  C --> D[Enters Voucher Details]
  D -->|Selects Type| E{Voucher Type}
  E -->|Service-based| F[Attach to a Service]
  E -->|Product-based| G[Attach to a Product]
  F --> H[Set Expiration & Restrictions]
  G --> H
  H --> I[Select Template or Upload Custom Design]
  I --> J[Generate QR Code & Unique Key]
  J --> K[Save & Confirm Voucher]
  K --> L[Voucher Created & Available]
`

### Voucher Purchase Flow (buyer experience)

All the users can interact with the stores page to select the service or product to buy a gift voucher and customize to use or give to another person. Reference: flows/buyer-flow.png

`graph TD;
  A[Customer Browses Store Page] --> B[Selects Voucher]
  B --> C[Customizes Voucher]
  C -->|Adds Recipient, Message, Template| D[Proceeds to Checkout]
  D --> E[Selects Payment Method]
  E -->|Confirms Payment| F[Payment Processing]
  F -->|Success| G[Voucher Generated]
  G --> H[Voucher Sent via Email]
  G --> I[Customer Can View in My Account]
  H --> J[Receives Confirmation Email with QR Code]
`
### Voucher Redemption Flow

The user go to the store or exchange it online to validate the one use of that voucher and access to the benefict (service or product). Reference flows/redemtion-flow.png

`graph TD;
  A[Customer Visits Store] --> B[Presents QR Code or Unique Key]
  B --> C[Store Manager Logs into Dashboard]
  C --> D[Accesses 'Redeem Voucher' Section]
  D -->|Scans QR Code| E[System Validates Voucher]
  D -->|Manually Enters Code| E
  E -->|Valid Voucher| F[Mark as Redeemed]
  F --> G[Update Customer & Store Records]
  G --> H[Transaction Completed]
  E -->|Invalid Voucher| I[Display Error Message]
`

### Administrator Oversight Flow
This is the main view of the dashboard for the stores to see the analytics and data for the vouchers that have been purchased, used, expired or resend those vouchers to the buyers. Reference: flows/admin-overview.png

`graph TD;
  A[Administrator Logs In] --> B[Accesses Admin Dashboard]
  B --> C[Manages Businesses & Users]
  B --> D[Oversees Voucher Transactions]
  B --> E[Monitors Sales & Redemption Data]
  C -->|Approve or Disable Stores| F[Update Store Status]
  D -->|View Active & Redeemed Vouchers| G[Export Reports]
  E -->|Analyze Sales Trends| H[Generate Analytics Reports]
  H --> I[Identify Growth Opportunities]
`

### **1.3 Analisis de mercado y competencias:**
https://docs.google.com/document/d/1BxpFzMfPuDJVSnw77Ef5vIN7iODImbm6NZtPzr1DvAs/edit?tab=t.0

### **1.3. Diseño y experiencia de usuario:**

> Proporciona imágenes y/o videotutorial mostrando la experiencia del usuario desde que aterriza en la aplicación, pasando por todas las funcionalidades principales.

### **1.4. Instrucciones de instalación:**
> Documenta de manera precisa las instrucciones para instalar y poner en marcha el proyecto en local (librerías, backend, frontend, servidor, base de datos, migraciones y semillas de datos, etc.)

---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**
> Usa el formato que consideres más adecuado para representar los componentes principales de la aplicación y las tecnologías utilizadas. Explica si sigue algún patrón predefinido, justifica por qué se ha elegido esta arquitectura, y destaca los beneficios principales que aportan al proyecto y justifican su uso, así como sacrificios o déficits que implica.


### **2.2. Descripción de componentes principales:**

> Describe los componentes más importantes, incluyendo la tecnología utilizada

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**

> Representa la estructura del proyecto y explica brevemente el propósito de las carpetas principales, así como si obedece a algún patrón o arquitectura específica.

### **2.4. Infraestructura y despliegue**

> Detalla la infraestructura del proyecto, incluyendo un diagrama en el formato que creas conveniente, y explica el proceso de despliegue que se sigue

### **2.5. Seguridad**

> Enumera y describe las prácticas de seguridad principales que se han implementado en el proyecto, añadiendo ejemplos si procede

### **2.6. Tests**

> Describe brevemente algunos de los tests realizados

---

## 3. Modelo de Datos

### **3.1. Diagrama del modelo de datos:**

> Recomendamos usar mermaid para el modelo de datos, y utilizar todos los parámetros que permite la sintaxis para dar el máximo detalle, por ejemplo las claves primarias y foráneas.


### **3.2. Descripción de entidades principales:**

> Recuerda incluir el máximo detalle de cada entidad, como el nombre y tipo de cada atributo, descripción breve si procede, claves primarias y foráneas, relaciones y tipo de relación, restricciones (unique, not null…), etc.

---

## 4. Especificación de la API

> Si tu backend se comunica a través de API, describe los endpoints principales (máximo 3) en formato OpenAPI. Opcionalmente puedes añadir un ejemplo de petición y de respuesta para mayor claridad

---

## 5. Historias de Usuario

PRD: https://docs.google.com/document/d/1cy7LfPV6TeUMitq3cQNGqtmtuxlmfG6iagUYqQQopuM/edit?usp=sharing

> Documenta 3 de las historias de usuario principales utilizadas durante el desarrollo, teniendo en cuenta las buenas prácticas de producto al respecto.

**Historia de Usuario 1**

**Historia de Usuario 2**

**Historia de Usuario 3**

---

## 6. Tickets de Trabajo

> Documenta 3 de los tickets de trabajo principales del desarrollo, uno de backend, uno de frontend, y uno de bases de datos. Da todo el detalle requerido para desarrollar la tarea de inicio a fin teniendo en cuenta las buenas prácticas al respecto. 

**Ticket 1**

**Ticket 2**

**Ticket 3**

---

## 7. Pull Requests

> Documenta 3 de las Pull Requests realizadas durante la ejecución del proyecto

**Pull Request 1**

**Pull Request 2**

**Pull Request 3**

