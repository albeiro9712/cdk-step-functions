# Arquitectura Serverless E-commerce en AWS

## Objetivo

Construir un sistema de procesamiento de órdenes usando servicios serverless de AWS para practicar:

- Orquestación distribuida
- Arquitectura orientada a eventos
- Procesamiento asíncrono
- Resiliencia
- Retries y DLQs
- Observabilidad

---

# Servicios Utilizados

## AWS Step Functions
Orquesta todo el workflow de la orden.

Responsabilidades:
- Secuencia de pasos
- Manejo de errores
- Retries
- Decisiones (Choice)
- Paralelismo
- Coordinación de Lambdas

---

## AWS Lambda
Ejecuta la lógica de negocio.

Lambdas sugeridas:
- CreateOrder
- ValidateStock
- ProcessPayment
- FraudCheck
- NotifyCustomer
- ShippingProcessor

---

## DynamoDB
Persistencia serverless.

Tablas:
- Orders
- Inventory

---

## SQS
Procesamiento desacoplado y asíncrono.

Cola:
- ShippingQueue

Uso:
- Procesos lentos
- Retries automáticos
- DLQ

---

## SNS
Fan-out de notificaciones.

Uso:
- Emails
- SMS
- Notificaciones internas

---

## EventBridge
Arquitectura orientada a eventos.

Eventos:
- OrderCreated
- PaymentApproved
- OrderConfirmed
- OrderFailed
- OrderShipped

---

# Arquitectura General

```text
                    Cliente
                        │
                        ▼
                 API Gateway
                        │
                        ▼
             Lambda CreateOrder
                        │
                        ▼
               DynamoDB Orders
                        │
                        ▼
             EventBridge EventBus
                        │
                        ▼
          Step Functions Workflow
                        │
      ┌─────────────────┼──────────────────┐
      ▼                 ▼                  ▼

 Lambda Validate   Lambda Payment   Lambda FraudCheck
     Stock             Processor

      │
      ▼

 DynamoDB Inventory

      │
      ▼

 Confirmar Orden
      │
      ▼

 Publicar SNS
      │
      ▼

 Enviar mensaje SQS
      │
      ▼

 Lambda Shipping
      │
      ▼

 Actualizar DynamoDB
```

---

# Flujo Completo

## 1. Crear Orden

El cliente realiza:

```http
POST /orders
```

API Gateway invoca:

- Lambda CreateOrder

La Lambda:
- Genera orderId
- Guarda en DynamoDB
- Publica evento OrderCreated
- Inicia Step Functions

---

## 2. Validar Inventario

Lambda ValidateStock:
- Consulta DynamoDB Inventory
- Verifica stock
- Reserva unidades

Si no hay stock:
- Workflow termina
- Orden falla

---

## 3. Procesar Pago

Lambda ProcessPayment:
- Simula Stripe/PayPal/Banco
- Aprueba o rechaza

Debe simular:
- Timeouts
- Errores aleatorios
- Retries

---

## 4. Validación Antifraude

Lambda FraudCheck:
- Genera score de riesgo
- Puede ejecutarse en paralelo

---

## 5. Confirmar Orden

Step Functions:
- Actualiza estado en DynamoDB
- Estado: CONFIRMED

---

## 6. Notificaciones

SNS publica:

```json
{
  "event": "ORDER_CONFIRMED"
}
```

Consumidores:
- Email service
- SMS service
- Analytics

---

## 7. Envío Asíncrono

Step Functions envía mensaje a:

- SQS ShippingQueue

Lambda Shipping:
- Consume mensajes
- Genera tracking
- Actualiza DynamoDB

---

# Características Técnicas Importantes

## Step Functions
Practicar:
- Choice
- Retry
- Catch
- Parallel

---

## SQS
Practicar:
- DLQ
- Retry Policy

---

## Lambda
Simular:
- Fallos
- Timeouts
- Latencia

---

## EventBridge
Practicar:
- Routing
- Eventos de negocio
- Arquitectura desacoplada

---

# Objetivos de Aprendizaje

Con este proyecto aprenderás:

- Serverless Architecture
- Event-Driven Design
- Orquestación distribuida
- Desacoplamiento
- Resiliencia
- Observabilidad
- Integración entre servicios AWS

---

# Mejoras Futuras

## Avanzado
- Saga Pattern
- Idempotencia
- FIFO Queues
- Event Sourcing
- CQRS
- Terraform/CDK
- X-Ray Tracing
- Multi-account EventBridge

---

# Resultado Esperado

Al finalizar este proyecto podrás entender y explicar:

- Cómo construir workflows distribuidos
- Cómo desacoplar sistemas
- Cómo manejar eventos de negocio
- Cómo implementar resiliencia en AWS
- Cómo funcionan arquitecturas serverless modernas
