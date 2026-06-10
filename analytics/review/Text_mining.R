

## Step-by-Step Text Mining and Cosine Distance Computation in R
###  Step 1: Load Required Libraries
#install.packages(c("tm", "slam", "proxy"))  # if not already installed
library(tm)
library(slam)
library(proxy)
###  Step 2: Create a Corpus

#You can modify the `texts` vector with your document contents.
texts<-reviews$Review

corpus <- VCorpus(VectorSource(texts))

###  Step 3: Preprocess the Text

corpus <- tm_map(corpus, content_transformer(tolower))
corpus <- tm_map(corpus, removePunctuation)
corpus <- tm_map(corpus, removeNumbers)
corpus <- tm_map(corpus, removeWords, stopwords("en"))
corpus <- tm_map(corpus, stripWhitespace)

###  Step 4: Create a Document-Term Matrix

dtm <- DocumentTermMatrix(corpus)

inspect(dtm)

###  Step 5: Compute Cosine Distance (Using `slam`)
numerator <- crossprod_simple_triplet_matrix(dtm)
denominator <- sqrt(col_sums(dtm^2)) %*% t(sqrt(col_sums(dtm^2)))
cosine_similarity <- numerator / denominator
cosine_distance <- 1 - cosine_similarity

### Step 6: Convert to Matrix for Inspection or Plotting

cosine_dist_matrix <- as.matrix(cosine_distance)
print(round(cosine_dist_matrix, 2))
###  Step 7: Visualize the Distance Matrix (Optional)

windows()
heatmap(cosine_dist_matrix, col = colorRampPalette(c("white", "steelblue"))(100))

###  Step 8: Cluster the Documents (Optional Extension)
library(proxy)
dtm_matrix <- as.matrix(dtm)  # Convert sparse DTM to full matrix
dist_obj <- proxy::dist(dtm_matrix, method = "cosine")  # Proper cosine distance

hclust_obj <- hclust(dist_obj, method = "ward.D2")
plot(hclust_obj, labels = paste("Doc", 1:nrow(dtm_matrix)), main = "Document Clustering")

install.packages(c("wordcloud", "RColorBrewer"))
library(wordcloud)
library(RColorBrewer)


# Convert DTM to matrix and compute word frequencies
m <- as.matrix(dtm)
v <- sort(colSums(m), decreasing = TRUE)
d <- data.frame(word = names(v), freq = v)


set.seed(123)  # for reproducibility
wordcloud(
  words = d$word,
  freq = d$freq,
  min.freq = 1,
  max.words = 100,
  random.order = FALSE,
  rot.per = 0.35,
  colors = brewer.pal(8, "Dark2")
)






























