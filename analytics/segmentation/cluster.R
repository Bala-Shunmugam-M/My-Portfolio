#creating New environment
segmentation <- new.env()
library(rattle)# calling the library
data <- DemoKTC # renaming the data set
#evaluating the data set
evalq({
  data <- DemoKTC
  nobs <- nrow(data)
}, segmentation)
DemoKTCKMEANS <- new.env(parent=segmentation)
# Clustering
model <- kmeans(x=na.omit(data), centers=3)
# Evaluating the cluster
evalq({
  model
}, DemoKTCKMEANS)

data2<-data# duplicating the data
data2$cluster<-model$cluster# writing the cluster membership in to the data








