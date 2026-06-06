const { Client } = require('@elastic/elasticsearch');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

let client = null;

try {
  if (process.env.ELASTICSEARCH_NODE) {
    client = new Client({ node: process.env.ELASTICSEARCH_NODE });
    logger.info(`Elasticsearch Client Initialized to ${process.env.ELASTICSEARCH_NODE}`);
  }
} catch (error) {
  logger.warn('Failed to initialize Elasticsearch client. Search will fallback to MongoDB.', error.message);
}

const indexProduct = async (product) => {
  if (!client) return;
  try {
    await client.index({
      index: 'products',
      id: product._id.toString(),
      body: {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        vendorId: product.vendorId.toString(),
        isActive: product.isActive
      }
    });
  } catch (error) {
    logger.warn(`Elasticsearch Indexing Failed: ${error.message}. Running fallback mode.`);
  }
};

const deleteProductIndex = async (id) => {
  if (!client) return;
  try {
    await client.delete({
      index: 'products',
      id: id.toString()
    });
  } catch (error) {
    logger.warn(`Elasticsearch deletion failed: ${error.message}`);
  }
};

const searchProductsIndex = async (queryText) => {
  if (!client) return null;
  try {
    const result = await client.search({
      index: 'products',
      body: {
        query: {
          multi_match: {
            query: queryText,
            fields: ['name^3', 'description', 'category^2']
          }
        }
      }
    });
    // Extract IDs
    return result.hits.hits.map(hit => hit._id);
  } catch (error) {
    logger.warn(`Elasticsearch search failed: ${error.message}`);
    return null;
  }
};

module.exports = {
  indexProduct,
  deleteProductIndex,
  searchProductsIndex,
  isAvailable: () => !!client
};
